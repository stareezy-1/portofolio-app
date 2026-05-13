/**
 * SEO Metadata generation utility.
 * Produces Open Graph metadata objects for pages.
 */

export interface PageContent {
  title: string;
  description: string;
  image?: string;
  url: string;
}

export interface OpenGraphMetadata {
  "og:title": string;
  "og:description": string;
  "og:image": string;
  "og:url": string;
}

export interface StructuredData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  image?: string;
}

export interface PageMetadata {
  openGraph: OpenGraphMetadata;
  structuredData: StructuredData;
}

const DEFAULT_IMAGE = "/og-default.png";
const SITE_NAME = "Portfolio";

/**
 * Generates Open Graph and structured data metadata from page content.
 * Ensures all og: fields are non-empty by using fallback values.
 */
export function generateMetadata(content: PageContent): PageMetadata {
  const title = content.title.trim() || SITE_NAME;
  const description = content.description.trim() || `${title} - ${SITE_NAME}`;
  const image = content.image?.trim() || DEFAULT_IMAGE;
  const url = content.url.trim() || "/";

  const openGraph: OpenGraphMetadata = {
    "og:title": title,
    "og:description": description,
    "og:image": image,
    "og:url": url,
  };

  const structuredData: StructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    image: image !== DEFAULT_IMAGE ? image : undefined,
  };

  return { openGraph, structuredData };
}

/**
 * Generates sitemap XML content for the given routes.
 */
export function generateSitemap(baseUrl: string, routes: string[]): string {
  const urls = routes
    .map(
      (route) =>
        `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Generates robots.txt content.
 */
export function generateRobotsTxt(baseUrl: string): string {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;
}
