import { ArrowRight, Compass } from "lucide-react";
import { data, Link } from "react-router";
import type { MetaFunction } from "react-router";

import { PageShell } from "~/components/layout";
import { Eyebrow } from "~/components/site";
import { Button } from "~/components/ui/button";
import { pageMeta } from "~/lib/seo";

export const meta: MetaFunction = () => [
  ...pageMeta({
    description: "The requested Cadena Labs page could not be found.",
    pathname: "/404",
    title: "Not Found | Cadena Labs",
  }),
  { name: "robots", content: "noindex" },
];

export function loader() {
  return data(null, { status: 404 });
}

export default function NotFound() {
  return (
    <PageShell>
      <main className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
        <Eyebrow>404</Eyebrow>
        <h1 className="text-balance font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
          That page could not be found.
        </h1>
        <p className="max-w-md text-base text-muted-foreground">
          The page may have moved, or the URL may be off by a character. Head
          home or pick a path below.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild size="lg" className="h-11 px-5 text-sm">
            <Link to="/">
              Return home
              <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 px-5 text-sm"
          >
            <Link to="/services">
              <Compass />
              Browse services
            </Link>
          </Button>
        </div>
      </main>
    </PageShell>
  );
}
