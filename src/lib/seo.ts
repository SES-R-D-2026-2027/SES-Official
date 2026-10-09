import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface BuildMetadataOptions {
  /** Page title without the site suffix; omit for the homepage. */
  title?: string;
  description?: string;
  /** Route path, e.g. "/events/hackathon". Used for the canonical URL and Open Graph. */
  path?: string;
  /** Absolute or root-relative image URL for Open Graph / Twitter cards. */
  image?: string;
  /** Hide the page from search engines (e.g. /styleguide). */
  noIndex?: boolean;
}

/** One helper for every page's metadata: unique title + description, canonical URL, Open Graph. */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image,
  noIndex = false,
}: BuildMetadataOptions = {}): Metadata {
  const fullTitle = title ? `${title} · ${siteConfig.shortName}` : siteConfig.name;
  const images = image ? [{ url: image }] : undefined;

  return {
    metadataBase: new URL(siteConfig.url),
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: path,
      images,
    },
    twitter: { card: image ? "summary_large_image" : "summary", title: fullTitle, description },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
