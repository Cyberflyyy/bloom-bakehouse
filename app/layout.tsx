import type { Metadata } from "next";
import "./globals.css";
import siteConfig from "@/site.config.json";
import type { SiteConfig } from "@/lib/types";
import { buildLocalBusinessJsonLd } from "@/lib/jsonld";

const config = siteConfig as unknown as SiteConfig;

// Vercel udostepnia VERCEL_URL przy buildzie — pozwala poprawnie rozwiazac
// wzgledne sciezki obrazow OG (inaczej Next ostrzega i uzywa localhost).
const baseUrl = config.site?.url
  ? config.site.url
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

// Google Fonts ladowane dynamicznie z theme (brief pozwala Claude wybrac dowolny font,
// wiec statyczna lista @import w CSS albo blokowala render 5 rodzinami, albo by nie
// zawierala wybranego fontu). Tu laduja sie dokladnie 2 rodziny z display=swap.
function googleFontsHref(): string {
  const families = [...new Set([config.theme.displayFont, config.theme.bodyFont].filter(Boolean))];
  const params = families
    .map((f) => `family=${f.trim().replace(/\s+/g, "+")}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

export const metadata: Metadata = {
  ...(baseUrl ? { metadataBase: new URL(baseUrl) } : {}),
  title: config.meta?.title || "Strona firmy",
  description: config.meta?.description || "Strona-preview wygenerowana przez Auto Web Agency",
  openGraph: {
    title: config.meta?.title || "Strona firmy",
    description: config.meta?.description || "",
    ...(config.meta?.ogImage ? { images: [{ url: config.meta.ogImage }] } : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonld = buildLocalBusinessJsonLd(config);
  return (
    <html lang="pl" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={googleFontsHref()} />
        {jsonld && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
