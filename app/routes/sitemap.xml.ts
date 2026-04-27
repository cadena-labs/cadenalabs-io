import { posts } from "~/data/blog";
import { services } from "~/data/services";
import { absoluteUrl } from "~/lib/seo";

const staticPaths = [
  "/",
  "/services",
  "/about",
  "/contact",
  "/community",
  "/residential",
  "/blog",
];

type SitemapUrl = {
  lastmod?: string;
  loc: string;
};

export function loader() {
  const urls: SitemapUrl[] = [
    ...staticPaths.map((pathname) => ({ loc: absoluteUrl(pathname) })),
    ...services.map((service) => ({
      loc: absoluteUrl(`/services/${service.slug}`),
    })),
    ...posts.map((post) => ({
      lastmod: post.date,
      loc: absoluteUrl(`/blog/${post.slug}`),
    })),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (url) =>
        `  <url><loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `<lastmod>${escapeXml(url.lastmod)}</lastmod>` : ""}</url>`,
    ),
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
