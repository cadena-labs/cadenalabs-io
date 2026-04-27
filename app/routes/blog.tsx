import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";

import { PageShell } from "~/components/layout";
import { PageHero, SectionIntro } from "~/components/site";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { posts } from "~/data/blog";
import { blogCollectionSchema } from "~/lib/schemas";
import { pageMeta } from "~/lib/seo";

export const meta: MetaFunction = () => [
  ...pageMeta({
    description:
      "Practical notes on UniFi, VLANs, network security, and small-business infrastructure from Cadena Labs.",
    pathname: "/blog",
    title: "Blog | Cadena Labs",
  }),
  { "script:ld+json": blogCollectionSchema() },
];

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));

export default function Blog() {
  return (
    <PageShell>
      <main>
        <PageHero
          eyebrow="Blog"
          title="Practical notes on networks, security, and infrastructure."
          description="Field-tested guidance on UniFi deployments, segmentation, secure remote access, and the everyday operational decisions that keep small-business networks healthy."
        />

        <section className="container-page py-12 md:py-16">
          <SectionIntro
            eyebrow="Latest"
            title="Guides for small-business operators"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block focus-visible:outline-none"
              >
                <Card className="h-full transition-all duration-200 ring-foreground/[0.07] group-hover:bg-card/95 group-hover:-translate-y-0.5 group-hover:ring-[var(--ring-brand)] group-focus-visible:ring-[var(--ring-brand-strong)]">
                  <CardContent className="flex h-full flex-col gap-4 px-6 py-6">
                    <Badge
                      variant="outline"
                      className="w-fit border-border/70 bg-card/80 text-muted-foreground"
                    >
                      {post.category}
                    </Badge>
                    <h2 className="font-display text-xl leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <time
                        dateTime={post.date}
                        className="font-mono text-xs text-muted-foreground"
                      >
                        {formatDate(post.date)}
                      </time>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                        Read
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
