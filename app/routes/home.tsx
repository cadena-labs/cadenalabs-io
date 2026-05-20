import {
  ArrowRight,
  CheckCircle2,
  Code,
  Network,
  Server,
  Shield,
} from "lucide-react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";

import { PageShell } from "~/components/layout";
import { CTASection, CtaButton, SectionIntro } from "~/components/site";
import { services } from "~/data/services";
import { organizationSchema } from "~/lib/schemas";
import { defaultSeoDescription, pageMeta } from "~/lib/seo";

export const meta: MetaFunction = () => [
  ...pageMeta({
    description: defaultSeoDescription,
    pathname: "/",
    title:
      "Cadena Labs | Small Business IT & Infrastructure in London, Ontario",
  }),
  { "script:ld+json": organizationSchema() },
];

const serviceIcons = [Network, Shield, Server, Code];

const proofPoints = [
  "5-50 person teams",
  "Infrastructure planning & procurement",
  "Professional firms, clinics, and local operators",
  "Structured technical guidance for growing businesses",
];

const outcomes = [
  {
    title: "Reliable Infrastructure",
    body: "From office WiFi stabilization to server and cloud planning, Cadena Labs builds systems that stay out of the way so your team can focus.",
  },
  {
    title: "Clear Technical Direction",
    body: "Cadena Labs provides technical partnership—helping you make practical hardware and software decisions without enterprise bloat.",
  },
  {
    title: "Security-Minded Baselines",
    body: "Every engagement starts with a security baseline—cleaner segmentation, safer remote access, and better identity controls.",
  },
];

export default function Home() {
  return (
    <PageShell>
      <main>
        <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-border/60">
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_42%,rgba(126,45,199,0.28),transparent_34%),linear-gradient(0deg,oklch(0.06_0_0)_0%,transparent_38%,oklch(0.06_0_0/0.8)_100%)]" />
          </div>

          <div className="container-page relative z-10 flex min-h-[calc(100svh-4rem)] items-center py-16 sm:py-20">
            <div className="max-w-4xl">
              <div className="hero-reveal flex flex-col gap-3">
                <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Small Business IT · Infrastructure · Security
                </p>
                <span
                  aria-hidden="true"
                  className="bg-brand-gradient h-px w-14 rounded-full"
                />
              </div>
              <h1 className="hero-reveal mt-10 text-balance font-display leading-[0.92] text-[clamp(4.25rem,12vw,10.5rem)] [--reveal-delay:100ms]">
                Cadena Labs
              </h1>
              <p className="hero-reveal mt-8 max-w-2xl text-balance text-3xl font-display leading-tight text-foreground [--reveal-delay:180ms] sm:text-4xl md:text-5xl">
                Technical mastery, applied to your infrastructure.
              </p>
              <p className="hero-reveal mt-6 max-w-2xl text-lg text-muted-foreground [--reveal-delay:260ms] sm:text-xl">
                Cadena Labs designs, deploys, and supports the systems small
                businesses rely on. From networking and security to procurement
                and infrastructure planning, the firm provides the technical
                direction your team needs.
              </p>
              <div className="hero-reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center [--reveal-delay:340ms]">
                <CtaButton href="/contact" className="h-12 px-6 text-base">
                  Send an inquiry
                  <ArrowRight />
                </CtaButton>
                <CtaButton
                  href="/services"
                  variant="outline"
                  className="h-12 px-6 text-base"
                >
                  Explore Services
                </CtaButton>
              </div>
              <p className="hero-reveal mt-8 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground [--reveal-delay:440ms]">
                Serving Southwestern Ontario
              </p>
            </div>
          </div>
        </section>

        <section className="container-page py-16 md:py-20">
          <SectionIntro
            eyebrow="Typical clients"
            title="Built for businesses where the technology just needs to work"
          >
            <p>
              Most small businesses do not need a bloated IT program. Cadena
              Labs stabilizes the environment, guides practical hardware
              decisions, and keeps infrastructure secure by default.
            </p>
          </SectionIntro>
          <div className="grid border-y border-border/70 sm:grid-cols-2 lg:grid-cols-4">
            {proofPoints.map((point) => (
              <div
                key={point}
                className="flex min-h-24 items-start gap-3 border-border/70 py-5 sm:px-5 sm:[&:not(:nth-child(2n))]:border-r lg:[&:not(:nth-child(2n))]:border-r-0 lg:[&:not(:last-child)]:border-r"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="text-sm text-foreground">{point}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="container-page py-16 md:py-20">
          <SectionIntro
            eyebrow="Services"
            title="Practical infrastructure work with a security baseline"
          />
          <div className="grid border-y border-border/70 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = serviceIcons[index] ?? Network;
              return (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="group relative flex min-h-80 flex-col gap-8 border-border/70 py-7 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-7 sm:[&:not(:nth-child(2n))]:border-r lg:[&:not(:nth-child(2n))]:border-r-0 lg:[&:not(:last-child)]:border-r"
                >
                  <span
                    aria-hidden="true"
                    className="gradient-ring opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-foreground/5 text-foreground ring-1 ring-foreground/10">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-display">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {service.cardDescription}
                    </p>
                  </div>
                  <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    Learn more
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="container-page py-16 md:py-20">
          <SectionIntro
            eyebrow="Proof & Outcomes"
            title="What this work looks like in practice"
          >
            <p>
              The work usually shows up as fewer support interruptions, safer
              remote access, cleaner segmentation, and infrastructure decisions
              that are easier to operate later.
            </p>
          </SectionIntro>
          <div className="grid gap-x-8 gap-y-8 border-t border-border/70 md:grid-cols-3">
            {outcomes.map((outcome, index) => (
              <div key={outcome.title} className="flex flex-col gap-3 pt-6">
                <span
                  aria-hidden="true"
                  className="gradient-text font-display text-4xl font-semibold leading-none tracking-tight tabular-nums"
                >
                  0{index + 1}
                </span>
                <h3 className="text-lg font-display">{outcome.title}</h3>
                <p className="text-sm text-muted-foreground">{outcome.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-page py-16 md:py-20">
          <div className="grid gap-8 border-t border-border/70 pt-10 md:grid-cols-[1.5fr_auto] md:items-end">
            <SectionIntro
              eyebrow="Community"
              title="Pro-bono IT for local non-profits"
              className="mb-0"
            >
              <p>
                Churches, shelters, food banks, and other registered non-profits
                in the London area can get networking and infrastructure help at
                no cost when capacity allows.
              </p>
            </SectionIntro>
            <Link
              to="/community"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-foreground/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:justify-self-end md:pb-1"
            >
              Learn about community support
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>

        <CTASection />
      </main>
    </PageShell>
  );
}
