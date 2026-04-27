import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { data, Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { PageShell } from "~/components/layout";
import { CTASection } from "~/components/site";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { getPost } from "~/data/blog";
import { blogPostingSchema } from "~/lib/schemas";
import { pageMeta } from "~/lib/seo";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = getPost(params.slug);

  if (!post) {
    throw data("Not Found", { status: 404 });
  }

  return post;
}

export const meta: MetaFunction<typeof loader> = ({ data: post }) => {
  const base = pageMeta({
    description: post?.excerpt ?? "Cadena Labs blog post.",
    pathname: post ? `/blog/${post.slug}` : "/blog",
    title: post ? `${post.title} | Cadena Labs` : "Blog | Cadena Labs",
    type: "article",
  });

  return post ? [...base, { "script:ld+json": blogPostingSchema(post) }] : base;
};

export function HydrateFallback() {
  return (
    <div className="container-page flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Loading article...
    </div>
  );
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));

export default function BlogDetail() {
  const post = useLoaderData<typeof loader>();

  return (
    <PageShell>
      <main>
        <article className="container-page max-w-3xl pb-16 pt-12 md:pt-16">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to blog
          </Link>

          <header className="mt-8 space-y-5">
            <Badge
              variant="outline"
              className="border-border/70 bg-card/80 text-muted-foreground"
            >
              {post.category}
            </Badge>
            <h1 className="text-balance font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            <time
              dateTime={post.date}
              className="block font-mono text-xs uppercase tracking-widest text-muted-foreground"
            >
              {formatDate(post.date)}
            </time>
          </header>

          <Separator className="my-10" />

          <div className="space-y-10">
            {post.body.map((section, index) => (
              <section
                key={section.heading ?? `section-${index}`}
                className="space-y-4"
              >
                {section.heading ? (
                  <h2 className="font-display text-2xl sm:text-3xl">
                    {section.heading}
                  </h2>
                ) : null}
                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-foreground/85"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="space-y-2.5">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-base text-foreground/85"
                      >
                        <Check
                          className="mt-1.5 h-4 w-4 shrink-0 text-foreground"
                          aria-hidden="true"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.gatewayTiers?.length ? (
                  <div className="space-y-3">
                    {section.gatewayTiers.map((row) => (
                      <div
                        key={row.href}
                        className="rounded-xl border border-border/60 bg-gradient-to-b from-card/90 to-card/60 p-4 ring-1 ring-foreground/[0.04] sm:p-5"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-4">
                          <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                            {row.tier}
                          </span>
                          <a
                            href={row.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex max-w-prose items-center gap-1.5 text-base font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-[var(--ring-brand)]"
                          >
                            {row.product}
                            <ExternalLink
                              className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <span className="sr-only">
                              (opens Ubiquiti store in a new tab)
                            </span>
                          </a>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                          {row.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {section.referenceList?.length ? (
                  <dl className="overflow-hidden rounded-xl border border-border/60 bg-gradient-to-b from-card/90 to-card/60 ring-1 ring-foreground/[0.04]">
                    {section.referenceList.map((row, rowIndex) => (
                      <div
                        key={`${row.label}-${rowIndex}`}
                        className="grid gap-1 border-border/50 px-4 py-3.5 sm:grid-cols-[minmax(0,10.5rem)_1fr] sm:gap-6 sm:px-5 [&:not(:last-child)]:border-b"
                      >
                        <dt className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                          {row.label}
                        </dt>
                        <dd className="text-[0.95rem] leading-relaxed text-foreground/90">
                          {row.detail}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {section.code ? (
                  <pre className="overflow-x-auto rounded-lg border border-border/60 bg-card/80 p-4 font-mono text-sm leading-relaxed text-foreground/90 ring-1 ring-foreground/[0.05]">
                    {section.code}
                  </pre>
                ) : null}
              </section>
            ))}
          </div>
        </article>
        <CTASection />
      </main>
    </PageShell>
  );
}
