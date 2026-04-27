import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("services", "routes/services.tsx"),
  route("services/:slug", "routes/service-detail.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
  route("community", "routes/community.tsx"),
  route("residential", "routes/residential.tsx"),
  route("blog", "routes/blog.tsx"),
  route("blog/:slug", "routes/blog-detail.tsx"),
  route("sitemap.xml", "routes/sitemap.xml.ts"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
