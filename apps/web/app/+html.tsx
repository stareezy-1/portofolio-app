// Root HTML for every statically-rendered web page.
// Runs in Node.js during `expo export --platform web`.
// https://docs.expo.dev/router/reference/static-rendering/#root-html

import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

const SITE_URL = "https://stareezy.tech";
const SITE_NAME = "Stareezy — Muhammad Bintang Al Akbar";
const SHORT_NAME = "Stareezy";
const DESCRIPTION =
  "Muhammad Bintang Al Akbar — Front-End Developer specializing in React & React Native. Building modern, performant web and mobile applications.";
const OG_IMAGE = `${SITE_URL}/og-image.svg`;
const THEME_COLOR = "#050505";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Muhammad Bintang Al Akbar",
      alternateName: "Stareezy",
      url: SITE_URL,
      image: `${SITE_URL}/icon-512.svg`,
      jobTitle: "Front-End Developer",
      description: DESCRIPTION,
      knowsAbout: [
        "React",
        "React Native",
        "TypeScript",
        "Next.js",
        "Expo",
        "Web Performance",
        "UI Engineering",
        "Design Systems",
      ],
      sameAs: ["https://github.com/stareezy"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: SITE_NAME,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      primaryImageOfPage: { "@id": `${SITE_URL}/#primaryimage` },
      inLanguage: "en",
    },
    {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#primaryimage`,
      url: OG_IMAGE,
      contentUrl: OG_IMAGE,
      width: 1200,
      height: 630,
    },
  ],
};

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* Search Console */}
        <meta name="google-site-verification" content="76720285c6e99e6d" />

        {/* Primary SEO */}
        <title>{SITE_NAME} — Front-End Developer Portfolio</title>
        <meta name="description" content={DESCRIPTION} />
        <meta
          name="keywords"
          content="Muhammad Bintang Al Akbar, Stareezy, front-end developer, React developer, React Native developer, TypeScript, Next.js, Expo, web developer portfolio, mobile developer portfolio, UI engineer, design systems"
        />
        <meta name="author" content="Muhammad Bintang Al Akbar" />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={`${SITE_URL}/`} />

        {/* Icons — explicit PNG for Google Search favicon detection */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.svg" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.svg" />
        <link rel="mask-icon" href="/favicon.svg" color={THEME_COLOR} />
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:title" content={SITE_NAME} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:type" content="image/svg+xml" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Stareezy — Front-End Developer Portfolio"
        />
        <meta property="og:site_name" content={SHORT_NAME} />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@stareezy" />
        <meta name="twitter:creator" content="@stareezy" />
        <meta name="twitter:title" content={SITE_NAME} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* PWA / Mobile */}
        <meta name="theme-color" content={THEME_COLOR} />
        <meta name="color-scheme" content="dark light" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content={SHORT_NAME} />
        <meta name="application-name" content={SHORT_NAME} />
        <meta name="msapplication-TileColor" content={THEME_COLOR} />
        <meta name="format-detection" content="telephone=no" />

        {/* Performance hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
