import type { BlogPost } from "~/data/blog";
import type { Service } from "~/data/services";
import { absoluteUrl, siteName, siteUrl } from "~/lib/seo";

const logoUrl = absoluteUrl("/images/cadenalabs-logo-no-bg.png");

const areaServed = {
  "@type": "City" as const,
  name: "London",
  containedInPlace: {
    "@type": "AdministrativeArea" as const,
    name: "Ontario",
    containedInPlace: {
      "@type": "Country" as const,
      name: "Canada",
    },
  },
};

const sameAs = [
  "https://www.facebook.com/profile.php?id=61585080770380",
  "https://www.tiktok.com/@cadenalabs",
  "https://x.com/Cadena_Labs",
];

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: logoUrl,
    description:
      "Networking, security, IT infrastructure, and custom web software for London, Ontario small businesses.",
    areaServed,
    sameAs,
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteName,
    url: siteUrl,
    logo: logoUrl,
    description:
      "Networking, security, IT infrastructure, and custom web software for London, Ontario small businesses.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressRegion: "Ontario",
      addressCountry: "CA",
    },
    areaServed,
    sameAs,
  };
}

export function serviceSchema(
  service: Pick<Service, "slug" | "name"> & {
    description: string;
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    areaServed,
  };
}

export function servicesCollectionSchema(serviceNames: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Business IT Services — ${siteName}`,
    description:
      "Business IT services for London, Ontario small businesses, including networking, security, practical infrastructure support, and digital modernization.",
    url: absoluteUrl("/services"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: serviceNames.map((name, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name,
      })),
    },
  };
}

export function blogCollectionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Blog — ${siteName}`,
    description:
      "Practical networking, UniFi, and security insights for London, Ontario small businesses.",
    url: absoluteUrl("/blog"),
  };
}

export function blogPostingSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    },
    articleSection: post.category,
  };
}
