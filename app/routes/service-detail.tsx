import { ArrowRight, Check, Target } from "lucide-react";
import { data, Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { PageShell } from "~/components/layout";
import { CTASection, CtaButton, Eyebrow, PageHero } from "~/components/site";
import { Separator } from "~/components/ui/separator";
import { getService, services } from "~/data/services";
import { serviceSchema } from "~/lib/schemas";
import { pageMeta } from "~/lib/seo";

export async function loader({ params }: LoaderFunctionArgs) {
  const service = getService(params.slug);

  if (!service) {
    throw data("Not Found", { status: 404 });
  }

  return service;
}

export const meta: MetaFunction<typeof loader> = ({ data: service }) => {
  const base = pageMeta({
    description: service?.description ?? "Cadena Labs service details.",
    pathname: service ? `/services/${service.slug}` : "/services",
    title: service ? `${service.name} | Cadena Labs` : "Service | Cadena Labs",
  });

  return service
    ? [...base, { "script:ld+json": serviceSchema(service) }]
    : base;
};

export function HydrateFallback() {
  return (
    <div className="container-page flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Loading service...
    </div>
  );
}

export default function ServiceDetail() {
  const service = useLoaderData<typeof loader>();
  const siblings = services.filter((item) => item.slug !== service.slug);

  return (
    <PageShell>
      <main>
        <section className="border-b border-border/60">
          <PageHero
            eyebrow="Service"
            title={service.name}
            description={service.description}
          >
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <CtaButton href="/contact">
                {service.ctaLabel}
                <ArrowRight />
              </CtaButton>
              <CtaButton href="/services" variant="outline">
                All Services
              </CtaButton>
            </div>
          </PageHero>
        </section>

        <section className="container-page grid gap-10 py-16 md:grid-cols-[1.5fr_1fr] md:py-20">
          <div className="space-y-6 border-y border-border/70 py-7">
            <div className="space-y-3">
              <Eyebrow>Scope</Eyebrow>
              <h2 className="font-display text-3xl">
                What Cadena Labs handles
              </h2>
            </div>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {service.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                    aria-hidden="true"
                  />
                  <span className="text-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 border-y border-border/70 py-7">
            <div className="space-y-3">
              <Eyebrow>Best Fit</Eyebrow>
              <h2 className="font-display text-2xl">Best fit for</h2>
            </div>
            <ul className="space-y-3">
              {service.bestFor.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <Target
                    className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="container-page py-16 md:py-20">
          <div className="mb-8 space-y-3">
            <Eyebrow>Outcomes</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl">
              What you should expect
            </h2>
          </div>
          <div className="grid gap-x-8 gap-y-6 border-t border-border/70 md:grid-cols-3">
            {service.outcomes.map((outcome, index) => (
              <div key={outcome} className="flex flex-col gap-3 pt-6">
                <span className="gradient-text font-mono text-xs font-semibold uppercase tracking-[0.18em] tabular-nums">
                  Outcome 0{index + 1}
                </span>
                <p className="text-base font-medium text-foreground">
                  {outcome}
                </p>
              </div>
            ))}
          </div>
        </section>

        {service.premium ? (
          <section className="container-page py-16 md:py-20">
            <div className="relative overflow-hidden border-y border-border/70 py-8 md:py-10">
              <span
                aria-hidden="true"
                className="bg-brand-gradient absolute inset-x-0 top-0 h-px"
              />
              <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:gap-10">
                <div className="space-y-4">
                  <span className="gradient-text inline-flex items-center text-[0.7rem] font-semibold uppercase tracking-[0.22em]">
                    Premium Tier
                  </span>
                  <h2 className="font-display text-3xl">
                    {service.premium.heading}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {service.premium.description}
                  </p>
                </div>
                <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-x-6">
                  {service.premium.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                        aria-hidden="true"
                      />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ) : null}

        {siblings.length ? (
          <section className="container-page py-12">
            <Separator className="mb-8" />
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="font-display text-xl text-muted-foreground">
                Other services
              </h2>
              <nav
                aria-label="Other services"
                className="flex flex-wrap items-center gap-2"
              >
                {siblings.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/services/${item.slug}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card/60 px-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-card"
                  >
                    {item.name}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                ))}
              </nav>
            </div>
          </section>
        ) : null}

        <CTASection
          title={service.ctaHeading}
          body={service.ctaDescription}
          label={service.ctaLabel}
        />
      </main>
    </PageShell>
  );
}
