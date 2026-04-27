export const siteUrl = "https://cadenalabs.io";
export const siteName = "Cadena Labs";

export const defaultSeoDescription =
  "Cadena Labs designs, deploys, and supports UniFi networks, secure remote access, firewalls, and practical IT infrastructure for London, Ontario small businesses.";

const defaultImagePath = "/og-image.png";

type PageMetaOptions = {
  title: string;
  description: string;
  pathname: string;
  imagePath?: string;
  type?: "article" | "website";
};

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteUrl).toString();
}

export function pageMeta({
  description,
  imagePath = defaultImagePath,
  pathname,
  title,
  type = "website",
}: PageMetaOptions) {
  const url = absoluteUrl(pathname);
  const image = absoluteUrl(imagePath);

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:site_name", content: siteName },
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}
