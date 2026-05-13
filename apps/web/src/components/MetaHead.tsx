import React from "react";
import { generateMetadata, PageContent } from "../utils/metadata";

export interface MetaHeadProps {
  content: PageContent;
}

/**
 * MetaHead renders Open Graph meta tags for SEO.
 * In Expo Router web, this can be used with the Head component.
 * For now, it injects meta tags via document head manipulation on web.
 */
export function useMetadata(content: PageContent) {
  const metadata = generateMetadata(content);

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    Object.entries(metadata.openGraph).forEach(([key, value]) => {
      setMeta(key, value);
    });

    // Set page title
    document.title = metadata.openGraph["og:title"];

    // Set structured data
    let scriptEl = document.querySelector('script[type="application/ld+json"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(metadata.structuredData);
  }, [metadata]);

  return metadata;
}
