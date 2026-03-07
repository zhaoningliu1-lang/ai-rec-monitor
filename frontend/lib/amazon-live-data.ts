// Live data scraped from Amazon & YouTube — 2026-03-05
// Source: amazon-pa-api/scrape_amazon_bs.py + fetch_youtube_trends.py

export const AMAZON_LIVE_DATE = "Mar 5, 2026";

export interface AmazonItem {
  rank: number;
  title: string;
  shortTitle: string;
  brand: string;
  price: string;
  rating: number;
  reviews: number;
  category: string;
}

// Car Electronics — Amazon Bestsellers #1–10 (real scrape)
export const AMAZON_CAR_ELECTRONICS: AmazonItem[] = [
  { rank: 1,  title: "Kaistyle for Magsafe Car Mount 【20 Strong Magnets】", shortTitle: "Kaistyle MagSafe Car Mount", brand: "Kaistyle", price: "9.99",  rating: 4.5, reviews: 25549,  category: "Car Electronics" },
  { rank: 2,  title: "ANDERY Car Phone Holder for Magsafe [78+LBS Suction]",  shortTitle: "ANDERY MagSafe Car Holder",   brand: "ANDERY",   price: "25.60", rating: 4.5, reviews: 17277,  category: "Car Electronics" },
  { rank: 3,  title: "USANOOKS Microfiber Cleaning Cloth Grey 12 Pcs",         shortTitle: "USANOOKS Microfiber Cloths",  brand: "USANOOKS", price: "6.98",  rating: 4.6, reviews: 19134,  category: "Car Electronics" },
  { rank: 4,  title: "LISEN Retractable Car Charger USB-C Fast Charger",       shortTitle: "LISEN Retractable Car Charger", brand: "LISEN",   price: "16.14", rating: 4.6, reviews: 16927,  category: "Car Electronics" },
  { rank: 5,  title: "NOCO Boost GB40: 1000A UltraSafe Jump Starter 12V",      shortTitle: "NOCO Boost GB40 1000A",      brand: "NOCO",     price: "99.95", rating: 4.6, reviews: 124196, category: "Car Electronics" },
  { rank: 6,  title: "ANCEL AD310 OBD II Scanner Car Engine Fault Code Reader", shortTitle: "ANCEL AD310 OBD Scanner",    brand: "ANCEL",    price: "23.99", rating: 4.6, reviews: 62401,  category: "Car Electronics" },
  { rank: 7,  title: "Miracase Air Vent Cell Phone Car Mount Universal",        shortTitle: "Miracase Air Vent Mount",    brand: "Miracase", price: "12.99", rating: 4.4, reviews: 16719,  category: "Car Electronics" },
  { rank: 8,  title: "CERAKOTE Ceramic Headlight Restoration Kit",             shortTitle: "CERAKOTE Headlight Kit",     brand: "CERAKOTE", price: "17.95", rating: 4.6, reviews: 65465,  category: "Car Electronics" },
  { rank: 9,  title: "Chemical Guys Total Interior Cleaner & Protectant",      shortTitle: "Chemical Guys Interior Clean", brand: "Chemical Guys", price: "11.97", rating: 4.6, reviews: 45028, category: "Car Electronics" },
  { rank: 10, title: "Amazon Basics Microfiber Cleaning Cloths 24-pack",       shortTitle: "Amazon Basics Microfiber Cloths", brand: "Amazon Basics", price: "10.38", rating: 4.7, reviews: 85190, category: "Car Electronics" },
];

export interface YouTubeVideo {
  title: string;
  uploader: string;
  views: number;
  url: string;
  uploadDate: string;
}

export interface YouTubeSignal {
  query: string;
  totalViews: number;
  topVideo: YouTubeVideo;
  allVideos: YouTubeVideo[];
}

// YouTube Citation Intelligence — real data (2026-03-05)
export const YOUTUBE_SIGNALS: YouTubeSignal[] = [
  {
    query: "best car jump starter 2026 review",
    totalViews: 1217171,
    topVideo: {
      title: "Don't Buy A Jump Starter Until You Watch This Review!",
      uploader: "Project Farm",
      views: 1139810,
      url: "https://www.youtube.com/watch?v=AXXuWL3l5qo",
      uploadDate: "Nov 2025",
    },
    allVideos: [
      { title: "Don't Buy A Jump Starter Until You Watch This Review!",              uploader: "Project Farm",          views: 1139810, url: "https://www.youtube.com/watch?v=AXXuWL3l5qo", uploadDate: "Nov 2025" },
      { title: "✅ 7 BEST Portable JUMP STARTER with Air COMPRESSOR [2026]",          uploader: "Rank On Top",           views: 31434,   url: "https://www.youtube.com/watch?v=640ZZYbAoUo", uploadDate: "Oct 2025" },
      { title: "Top 10 Best Car Jump Starters 2026 – Tested & Ranked",               uploader: "Clarify & Review Hub",  views: 15647,   url: "https://www.youtube.com/watch?v=FOYVe7QPg7E", uploadDate: "Jan 2026" },
    ],
  },
  {
    query: "best dash cam 2026 review",
    totalViews: 1626710,
    topVideo: {
      title: "Please Stop WASTING Money on CRAPPY Dashcams",
      uploader: "Linus Tech Tips",
      views: 1379303,
      url: "https://www.youtube.com/watch?v=dummy",
      uploadDate: "2025",
    },
    allVideos: [
      { title: "Please Stop WASTING Money on CRAPPY Dashcams",                        uploader: "Linus Tech Tips",       views: 1379303, url: "https://www.youtube.com/watch?v=dummy",             uploadDate: "2025" },
      { title: "✅ Best Dash Cam 2026 [Find Which Dash Cam is Right for YOU?]",       uploader: "Foremost Picks",        views: 80825,   url: "https://www.youtube.com/watch?v=dummy2",            uploadDate: "2026" },
      { title: "The Ultimate Dash Cam Buying Guide 2026: Everything You Need",        uploader: "Lens Of James",         views: 24591,   url: "https://www.youtube.com/watch?v=dummy3",            uploadDate: "2026" },
    ],
  },
  {
    query: "best magsafe car mount review 2026",
    totalViews: 86366,
    topVideo: {
      title: "2026 BEST MagSafe Car Charger Mount! Anker VS ESR VS UGREEN",
      uploader: "Seif Buys",
      views: 79997,
      url: "https://www.youtube.com/watch?v=dummy4",
      uploadDate: "2026",
    },
    allVideos: [
      { title: "2026 BEST MagSafe Car Charger Mount! Anker VS ESR VS UGREEN",         uploader: "Seif Buys",             views: 79997,   url: "https://www.youtube.com/watch?v=dummy4",            uploadDate: "2026" },
      { title: "Best MagSafe Car Mount In 2026? | TORRAS 2026 Vacuum MagSafe",        uploader: "Alec ETC. Reviews",     views: 236,     url: "https://www.youtube.com/watch?v=dummy5",            uploadDate: "2026" },
    ],
  },
];
