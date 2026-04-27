import {
  ArrowRight,
  ClipboardList,
  Code,
  Compass,
  LifeBuoy,
  Network,
  Server,
  Shield,
  Wrench,
} from "lucide-react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";

import { PageShell } from "~/components/layout";
import { CTASection, PageHero, SectionIntro } from "~/components/site";
import { services } from "~/data/services";
import { servicesCollectionSchema } from "~/lib/schemas";
import { pageMeta } from "~/lib/seo";

export const meta: MetaFunction = () => [
  ...pageMeta({
    description:
      "Business IT, infrastructure, and digital modernization for London, Ontario small businesses. Networking, security baselines, hardware procurement, custom web software, and technical direction.",
    pathname: "/services",
    title: "Services | Cadena Labs",
  }),
  { "script:ld+json": servicesCollectionSchema(services.map((s) => s.name)) },
];

const serviceIcons = [Network, Shield, Server, Code];

const processSteps = [
  {
    icon: Compass,
    title: "Technical Review",
    description:
      "Focused conversation about your current setup, constraints, and the most important technical debt to resolve.",
  },
  {
    icon: ClipboardList,
    title: "Recommended Scope",
    description:
      "A clear, written proposal with options, trade-offs, and a defensible infrastructure budget.",
  },
  {
    icon: Wrench,
    title: "Implementation",
    description:
      "Hands-on installation, configuration, and migration with a focus on stability and security.",
  },
  {
    icon: LifeBuoy,
    title: "Ongoing Support",
    description:
      "Right-sized technical support. Cadena Labs stays involved as a partner for as much or as little as you need.",
  },
];

export default function Services() {
  return (
    <PageShell>
      <main>
        <PageHero
          eyebrow="Business Services"
          title="IT services that solve real infrastructure and security problems."
          description="From networking and office WiFi upgrades to security baselines, hardware procurement, and server or cloud planning, Cadena Labs helps small businesses build dependable systems."
        />

        <section className="container-page py-12">
          <div className="grid border-y border-border/70 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="flex min-h-56 flex-col gap-4 border-border/70 py-6 md:px-6 md:[&:not(:nth-child(2n))]:border-r lg:[&:not(:nth-child(2n))]:border-r-0 lg:[&:not(:last-child)]:border-r"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground/5 text-foreground ring-1 ring-foreground/10">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className="gradient-text font-mono text-xs font-semibold uppercase tracking-[0.18em] tabular-nums">
                      Step 0{index + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="container-page py-16 md:py-20">
          <SectionIntro
            eyebrow="Service Areas"
            title="Focused support for the systems small teams rely on"
          />
          <div className="divide-y divide-border/70 border-y border-border/70">
            {services.map((service, index) => {
              const Icon = serviceIcons[index] ?? Network;
              return (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="group grid gap-5 py-7 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground/5 text-foreground ring-1 ring-foreground/10">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl">{service.name}</h2>
                    <p className="text-sm font-medium text-foreground/90">
                      {service.tagline}
                    </p>
                    <p className="max-w-3xl text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="hidden h-5 w-5 text-foreground transition-transform group-hover:translate-x-1 sm:block"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        <CTASection />
      </main>
    </PageShell>
  );
}
