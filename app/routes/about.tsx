import { ArrowRight, ClipboardList, Network, ShieldCheck } from "lucide-react";
import type { MetaFunction } from "react-router";

import { PageShell } from "~/components/layout";
import {
  CTASection,
  CtaButton,
  PageHero,
  SectionIntro,
} from "~/components/site";
import { localBusinessSchema } from "~/lib/schemas";
import { pageMeta } from "~/lib/seo";

export const meta: MetaFunction = () => [
  ...pageMeta({
    description:
      "Cadena Labs helps London, Ontario small businesses plan networks, harden access, and run dependable infrastructure—without enterprise overhead.",
    pathname: "/about",
    title: "About | Cadena Labs",
  }),
  { "script:ld+json": localBusinessSchema() },
];

const values = [
  {
    icon: Network,
    title: "Infrastructure that fits",
    description:
      "Cadena Labs designs and tunes office WiFi, routing, and segmentation for how your team actually works—so upgrades stick and support calls quiet down.",
  },
  {
    icon: ClipboardList,
    title: "Clear decisions, fewer surprises",
    description:
      "You get plain-language options, trade-offs, and a roadmap—whether you are refreshing UniFi, tightening firewall rules, or planning the next site.",
  },
  {
    icon: ShieldCheck,
    title: "Security-minded by default",
    description:
      "Every engagement starts from a practical baseline: identity, remote access, segmentation, and recovery—scaled to small-business reality, not buzzwords.",
  },
];

const capabilities = [
  "Network design, UniFi deployments, and WiFi remediation",
  "Firewalling, VPNs, and safer remote access patterns",
  "Documentation and handoff so your team or MSP can operate with confidence",
];

export default function About() {
  return (
    <PageShell>
      <main>
        <PageHero
          eyebrow="About"
          title="IT infrastructure and security consulting built for small businesses."
        />

        <section className="container-page grid gap-10 py-12 md:grid-cols-[0.95fr_1.05fr] md:items-center md:py-16">
          <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-md border border-border/70 bg-card/50 px-8 py-12 md:min-h-[280px]">
            <img
              src="/images/cadenalabs-logo-no-bg.png"
              alt="Cadena Labs"
              width={320}
              height={120}
              className="max-h-28 w-auto object-contain md:max-h-32"
            />
            <span
              aria-hidden="true"
              className="bg-brand-gradient absolute inset-x-0 bottom-0 h-1"
            />
          </div>

          <div className="flex flex-col gap-5">
            <h2 className="font-display text-3xl sm:text-4xl">
              What Cadena Labs does
            </h2>
            <div className="space-y-3 text-base text-muted-foreground">
              <p>
                Cadena Labs is a London, Ontario consultancy focused on
                networking, infrastructure planning, and practical security for
                teams that need reliable systems without a full enterprise
                stack.
              </p>
              <p>
                Cadena Labs works with owners and operators who want honest
                assessments, careful execution, and documentation that survives
                staff changes. Engagements range from focused reviews to
                hands-on implementation and follow-up.
              </p>
            </div>
            <ul className="space-y-2.5 border-t border-border/60 pt-4 text-sm text-muted-foreground">
              {capabilities.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/35"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <CtaButton href="/contact">
                Send an inquiry
                <ArrowRight />
              </CtaButton>
              <CtaButton href="/services" variant="outline">
                View Services
              </CtaButton>
            </div>
          </div>
        </section>

        <section className="container-page py-16 md:py-20">
          <SectionIntro eyebrow="The Name" title="Why Cadena?" align="center">
            <p>
              &quot;Cadena&quot; means <em>chain</em> in Spanish. It reflects
              how Cadena Labs approaches resilient systems: strong links between
              your business and the technology it depends on—connected,
              accountable, and built to hold up under real-world use.
            </p>
          </SectionIntro>
        </section>

        <section className="container-page py-16 md:py-20">
          <SectionIntro
            eyebrow="Why Cadena Labs"
            title="How Cadena Labs works with clients"
          />
          <div className="grid border-y border-border/70 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="flex flex-col gap-4 border-border/70 py-6 md:px-6 md:[&:not(:last-child)]:border-r"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-foreground/5 text-foreground ring-1 ring-foreground/10">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <CTASection />
      </main>
    </PageShell>
  );
}
