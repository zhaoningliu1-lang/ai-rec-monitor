"""Shopify Storefront + Admin API + MCP integration.

P1: Storefront API — query products, create carts, get checkout URLs
P2: Admin API — create "shadow store" products synced from Amazon data
MCP: Connect to any Shopify store's MCP endpoint for agent-to-agent commerce

Authentication:
- Storefront API: X-Shopify-Storefront-Access-Token header (or tokenless)
- Admin API: X-Shopify-Access-Token header (OAuth or custom app token)
- MCP: No auth needed for Storefront MCP

References:
- Storefront API: https://shopify.dev/docs/api/storefront
- Admin API: https://shopify.dev/docs/api/admin-graphql
- Storefront MCP: https://shopify.dev/docs/apps/build/storefront-mcp
"""

import hashlib
import json
import logging
from datetime import datetime, timezone
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

# ── Cache ──────────────────────────────────────────────────────────────────

_cache: dict[str, tuple[float, Any]] = {}
_CACHE_TTL = 3600  # 1 hour


def _ck(prefix: str, *args: str) -> str:
    return hashlib.md5(f"{prefix}:{':'.join(args)}".encode()).hexdigest()


def _get(key: str) -> Any | None:
    if key in _cache:
        ts, data = _cache[key]
        if datetime.now(timezone.utc).timestamp() - ts < _CACHE_TTL:
            return data
        del _cache[key]
    return None


def _set(key: str, data: Any) -> None:
    _cache[key] = (datetime.now(timezone.utc).timestamp(), data)


# ═══════════════════════════════════════════════════════════════════════════
# P1: STOREFRONT API — Read-only product queries + cart creation
# ═══════════════════════════════════════════════════════════════════════════

async def _storefront_query(shop_domain: str, query: str, variables: dict | None = None,
                             storefront_token: str | None = None) -> dict | None:
    """Execute a Storefront API GraphQL query."""
    url = f"https://{shop_domain}/api/2026-01/graphql.json"
    headers = {"Content-Type": "application/json"}
    if storefront_token:
        headers["X-Shopify-Storefront-Access-Token"] = storefront_token

    payload: dict = {"query": query}
    if variables:
        payload["variables"] = variables

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                if "errors" in data:
                    logger.warning("Storefront GQL errors: %s", data["errors"])
                return data.get("data")
            logger.warning("Storefront API %d: %s", resp.status_code, resp.text[:200])
            return None
    except Exception as e:
        logger.error("Storefront API request failed: %s", e)
        return None


async def search_products(shop_domain: str, query_text: str, limit: int = 10,
                           storefront_token: str | None = None) -> list[dict]:
    """Search products on a Shopify store via Storefront API."""
    ck = _ck("sf_search", shop_domain, query_text)
    cached = _get(ck)
    if cached is not None:
        return cached

    gql = """
    query SearchProducts($query: String!, $first: Int!) {
      search(query: $query, first: $first, types: PRODUCT) {
        edges {
          node {
            ... on Product {
              id
              title
              handle
              description(truncateAt: 300)
              productType
              vendor
              onlineStoreUrl
              priceRange {
                minVariantPrice { amount currencyCode }
                maxVariantPrice { amount currencyCode }
              }
              images(first: 1) {
                edges { node { url altText width height } }
              }
              variants(first: 5) {
                edges {
                  node {
                    id
                    title
                    price { amount currencyCode }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    }
    """
    data = await _storefront_query(shop_domain, gql,
                                    {"query": query_text, "first": limit},
                                    storefront_token)
    if not data or "search" not in data:
        return []

    products = []
    for edge in data["search"].get("edges", []):
        node = edge.get("node", {})
        if not node.get("title"):
            continue
        products.append({
            "id": node.get("id", ""),
            "title": node.get("title", ""),
            "handle": node.get("handle", ""),
            "description": node.get("description", ""),
            "product_type": node.get("productType", ""),
            "vendor": node.get("vendor", ""),
            "url": node.get("onlineStoreUrl", ""),
            "price_min": node.get("priceRange", {}).get("minVariantPrice", {}).get("amount"),
            "price_max": node.get("priceRange", {}).get("maxVariantPrice", {}).get("amount"),
            "currency": node.get("priceRange", {}).get("minVariantPrice", {}).get("currencyCode", "USD"),
            "image_url": (node.get("images", {}).get("edges", [{}])[0].get("node", {}).get("url") if node.get("images", {}).get("edges") else None),
            "variants": [
                {
                    "id": v["node"]["id"],
                    "title": v["node"]["title"],
                    "price": v["node"]["price"]["amount"],
                    "available": v["node"]["availableForSale"],
                }
                for v in node.get("variants", {}).get("edges", [])
            ],
        })

    _set(ck, products)
    return products


async def create_cart(shop_domain: str, variant_id: str, quantity: int = 1,
                       storefront_token: str | None = None) -> dict | None:
    """Create a cart on a Shopify store and return checkout URL."""
    gql = """
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount { amount currencyCode }
            subtotalAmount { amount currencyCode }
          }
          lines(first: 5) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant { id title product { title } }
                }
                cost { totalAmount { amount currencyCode } }
              }
            }
          }
        }
        userErrors { field message }
      }
    }
    """
    variables = {
        "input": {
            "lines": [{"merchandiseId": variant_id, "quantity": quantity}]
        }
    }
    data = await _storefront_query(shop_domain, gql, variables, storefront_token)
    if not data or "cartCreate" not in data:
        return None

    cart_data = data["cartCreate"]
    if cart_data.get("userErrors"):
        logger.warning("Cart creation errors: %s", cart_data["userErrors"])
        return None

    cart = cart_data.get("cart", {})
    return {
        "cart_id": cart.get("id"),
        "checkout_url": cart.get("checkoutUrl"),
        "total_quantity": cart.get("totalQuantity", 0),
        "total_amount": cart.get("cost", {}).get("totalAmount", {}).get("amount"),
        "currency": cart.get("cost", {}).get("totalAmount", {}).get("currencyCode", "USD"),
        "items": [
            {
                "title": e["node"]["merchandise"]["product"]["title"],
                "variant": e["node"]["merchandise"]["title"],
                "quantity": e["node"]["quantity"],
                "amount": e["node"]["cost"]["totalAmount"]["amount"],
            }
            for e in cart.get("lines", {}).get("edges", [])
        ],
    }


# ═══════════════════════════════════════════════════════════════════════════
# P1: STOREFRONT MCP — Connect to any Shopify store's MCP endpoint
# ═══════════════════════════════════════════════════════════════════════════

async def mcp_call(shop_domain: str, tool_name: str, arguments: dict | None = None) -> dict | None:
    """Call a Shopify Storefront MCP tool (JSON-RPC 2.0). No auth needed."""
    url = f"https://{shop_domain}/api/mcp"
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": arguments or {},
        },
    }
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
            if resp.status_code == 200:
                data = resp.json()
                return data.get("result")
            logger.warning("MCP %d: %s", resp.status_code, resp.text[:200])
            return None
    except Exception as e:
        logger.error("MCP call failed: %s", e)
        return None


async def mcp_list_tools(shop_domain: str) -> list[dict]:
    """List available MCP tools on a Shopify store."""
    url = f"https://{shop_domain}/api/mcp"
    payload = {"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
            if resp.status_code == 200:
                data = resp.json()
                return data.get("result", {}).get("tools", [])
            return []
    except Exception as e:
        logger.warning("MCP tools/list failed: %s", e)
        return []


async def mcp_search_products(shop_domain: str, query: str) -> dict | None:
    """Search a store's catalog via MCP."""
    return await mcp_call(shop_domain, "search_shop_catalog", {"query": query})


# ═══════════════════════════════════════════════════════════════════════════
# P2: ADMIN API — Shadow Store: sync Amazon products → Shopify
# ═══════════════════════════════════════════════════════════════════════════

async def _admin_query(shop_domain: str, admin_token: str, query: str,
                        variables: dict | None = None) -> dict | None:
    """Execute an Admin API GraphQL query."""
    url = f"https://{shop_domain}/admin/api/2026-01/graphql.json"
    headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": admin_token,
    }
    payload: dict = {"query": query}
    if variables:
        payload["variables"] = variables

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("errors"):
                    logger.warning("Admin GQL errors: %s", data["errors"])
                return data.get("data")
            logger.warning("Admin API %d: %s", resp.status_code, resp.text[:200])
            return None
    except Exception as e:
        logger.error("Admin API request failed: %s", e)
        return None


async def sync_product_to_shopify(
    shop_domain: str,
    admin_token: str,
    amazon_product: dict,
    brand: str,
) -> dict | None:
    """Create a product on Shopify from Amazon product data (shadow store sync).

    Takes an Amazon product dict (from Rainforest API) and creates a corresponding
    Shopify product via the Admin API.
    """
    title = amazon_product.get("title", "")
    price = amazon_product.get("price", 0)
    asin = amazon_product.get("asin", "")
    url = amazon_product.get("url", "")

    if not title:
        return None

    # Create product with single variant
    gql = """
    mutation ProductCreate($product: ProductCreateInput!) {
      productCreate(product: $product) {
        product {
          id
          title
          handle
          status
          onlineStoreUrl
          variants(first: 1) {
            edges { node { id title price } }
          }
        }
        userErrors { field message }
      }
    }
    """
    variables = {
        "product": {
            "title": title,
            "vendor": brand,
            "productType": amazon_product.get("category", ""),
            "tags": [f"asin:{asin}", "source:amazon", "synced-by:avanti"],
            "status": "ACTIVE",
        }
    }

    data = await _admin_query(shop_domain, admin_token, gql, variables)
    if not data or "productCreate" not in data:
        return None

    result = data["productCreate"]
    if result.get("userErrors"):
        logger.warning("Product create errors: %s", result["userErrors"])
        return {"error": result["userErrors"]}

    product = result.get("product", {})

    # Set variant price if product was created
    variant_edges = product.get("variants", {}).get("edges", [])
    if variant_edges and price > 0:
        variant_id = variant_edges[0]["node"]["id"]
        await _set_variant_price(shop_domain, admin_token, variant_id, price)

    return {
        "shopify_id": product.get("id"),
        "title": product.get("title"),
        "handle": product.get("handle"),
        "status": product.get("status"),
        "url": product.get("onlineStoreUrl"),
        "amazon_asin": asin,
    }


async def _set_variant_price(shop_domain: str, admin_token: str,
                              variant_id: str, price: float) -> None:
    """Set variant price via Admin API."""
    gql = """
    mutation VariantUpdate($input: ProductVariantInput!) {
      productVariantUpdate(input: $input) {
        productVariant { id price }
        userErrors { field message }
      }
    }
    """
    await _admin_query(shop_domain, admin_token, gql, {
        "input": {"id": variant_id, "price": str(price)}
    })


async def sync_brand_to_shadow_store(
    shop_domain: str,
    admin_token: str,
    brand: str,
) -> dict:
    """Sync all of a brand's Amazon products to a Shopify shadow store.

    Fetches brand's Amazon catalog via Rainforest API, then creates each product
    on the Shopify store. Tags products with ASIN for cross-platform linking.
    """
    from app.services.amazon_service import search_brand

    # 1. Fetch brand's Amazon products
    try:
        amazon_data = await search_brand(brand)
    except Exception as e:
        return {"error": f"Failed to fetch Amazon data: {e}", "synced": 0}

    if not amazon_data or not amazon_data.get("top_products"):
        return {"error": "No Amazon products found", "synced": 0}

    products = amazon_data["top_products"]

    # 2. Sync each product
    synced = []
    errors = []
    for p in products[:20]:  # Limit to 20 products per sync
        result = await sync_product_to_shopify(shop_domain, admin_token, p, brand)
        if result and "error" not in result:
            synced.append(result)
        else:
            errors.append({"asin": p.get("asin"), "error": str(result)})

    return {
        "brand": brand,
        "shop_domain": shop_domain,
        "synced": len(synced),
        "errors": len(errors),
        "products": synced,
        "error_details": errors[:5],
        "note": "Products tagged with 'source:amazon' and 'synced-by:avanti' for tracking. "
                "AI agents can now discover these products via Shopify Storefront MCP.",
    }


# ═══════════════════════════════════════════════════════════════════════════
# UTILITY: Check store's agent readiness
# ═══════════════════════════════════════════════════════════════════════════

async def check_agent_readiness(shop_domain: str) -> dict:
    """Check if a Shopify store is ready for AI agent commerce."""
    checks = {
        "storefront_api": False,
        "mcp_enabled": False,
        "mcp_tools": [],
        "product_count": 0,
        "agent_ready": False,
    }

    # Check Storefront API
    try:
        gql = "query { shop { name } }"
        data = await _storefront_query(shop_domain, gql)
        checks["storefront_api"] = data is not None
    except Exception:
        pass

    # Check MCP
    try:
        tools = await mcp_list_tools(shop_domain)
        checks["mcp_enabled"] = len(tools) > 0
        checks["mcp_tools"] = [t.get("name", "") for t in tools]
    except Exception:
        pass

    # Check product count via Storefront
    try:
        gql = "query { products(first: 1) { edges { node { id } } } }"
        data = await _storefront_query(shop_domain, gql)
        if data and "products" in data:
            checks["product_count"] = len(data["products"].get("edges", []))
    except Exception:
        pass

    checks["agent_ready"] = checks["storefront_api"] and checks["mcp_enabled"]
    return checks
