import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Avanti Growth Labs LLC — Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-invert max-w-3xl mx-auto py-12" style={{ color: "#d4d4d8" }}>
      <h1 style={{ color: "#f0f0f8" }}>Privacy Policy</h1>
      <p className="text-sm" style={{ color: "#a1a1aa" }}>
        Last updated: March 15, 2026
      </p>

      <p>
        Avanti Growth Labs LLC (&quot;Avanti,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the
        website <a href="https://avantia2a.com" style={{ color: "#60a5fa" }}>avantia2a.com</a> and
        related services (collectively, the &quot;Service&quot;). This Privacy Policy describes how we
        collect, use, and protect your information when you use our Service.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>1. Information We Collect</h2>

      <h3 style={{ color: "#e4e4e7" }}>1.1 Account Information</h3>
      <p>
        When you create an account, we collect your email address and password. If you sign up
        through a third-party provider (e.g., Google), we receive your name and email from that provider.
      </p>

      <h3 style={{ color: "#e4e4e7" }}>1.2 Usage Data</h3>
      <p>
        We automatically collect information about how you interact with our Service, including
        pages visited, features used, timestamps, and referring URLs. This data is collected
        through standard server logs and analytics.
      </p>

      <h3 style={{ color: "#e4e4e7" }}>1.3 Brand and Product Data</h3>
      <p>
        When you use our AI visibility monitoring tools, you provide brand names, product
        categories, and related business information. We process this data to generate analytics
        reports and recommendations.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>2. How We Use Your Information</h2>
      <ul>
        <li>To provide, maintain, and improve the Service</li>
        <li>To generate AI visibility reports, competitive analysis, and optimization recommendations</li>
        <li>To process transactions and manage your account</li>
        <li>To communicate with you about the Service, including updates and support</li>
        <li>To detect and prevent fraud, abuse, or security incidents</li>
      </ul>

      <h2 style={{ color: "#f0f0f8" }}>3. Third-Party Services</h2>
      <p>
        Our Service integrates with third-party AI platforms (such as OpenAI, Anthropic, and Google)
        to perform brand visibility analysis. We send query prompts to these platforms and receive
        text responses. We do not send your personal information to these platforms — only brand and
        product-related queries.
      </p>
      <p>
        We may also access publicly available data from platforms including TikTok Shop, YouTube,
        Reddit, and Google Trends for market intelligence purposes.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>4. Data Storage and Security</h2>
      <p>
        Your data is stored on servers located in the <strong>United States</strong>. We use
        industry-standard security measures including:
      </p>
      <ul>
        <li>HTTPS/TLS 1.2+ encryption for all data in transit</li>
        <li>AES-256 encryption for data at rest</li>
        <li>Managed PostgreSQL with SSL connections</li>
        <li>Access restricted to authorized personnel only</li>
      </ul>

      <h2 style={{ color: "#f0f0f8" }}>5. Data Retention</h2>
      <p>
        We retain your account information for as long as your account is active. AI visibility
        scan results and reports are retained to provide historical trend analysis. You may request
        deletion of your data at any time by contacting us.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>6. Data Sharing</h2>
      <p>We do not sell your personal information. We may share data only in the following cases:</p>
      <ul>
        <li>With your consent</li>
        <li>To comply with legal obligations or valid legal process</li>
        <li>With service providers who assist in operating our Service (e.g., cloud hosting, payment processing), subject to confidentiality obligations</li>
        <li>In connection with a merger, acquisition, or sale of assets</li>
      </ul>

      <h2 style={{ color: "#f0f0f8" }}>7. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access, correct, or delete your personal information</li>
        <li>Export your data in a portable format</li>
        <li>Opt out of marketing communications</li>
        <li>Request information about how your data is processed</li>
      </ul>

      <h2 style={{ color: "#f0f0f8" }}>8. Cookies</h2>
      <p>
        We use essential cookies to maintain your session and authentication state. We do not use
        third-party advertising cookies.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>9. Children&apos;s Privacy</h2>
      <p>
        Our Service is not directed to individuals under the age of 18. We do not knowingly collect
        personal information from children.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of material changes
        by posting the updated policy on this page with a revised &quot;Last updated&quot; date.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>11. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy or wish to exercise your data rights,
        please contact us:
      </p>
      <ul>
        <li>Email: <a href="mailto:hello@avantia2a.com" style={{ color: "#60a5fa" }}>hello@avantia2a.com</a></li>
        <li>Company: Avanti Growth Labs LLC</li>
        <li>Address: 700 Edgewater Blvd Apt 104, Foster City, CA 94404, United States</li>
      </ul>
    </article>
  );
}
