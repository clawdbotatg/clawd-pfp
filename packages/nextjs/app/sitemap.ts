import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_URL || "https://clawdpfp.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // Minting is closed. The gallery is frozen, so the only thing worth
  // pointing crawlers at is the root page.
  return [{ url: `${baseUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 }];
}
