import {
  Home as HomeIcon,
  Lightbulb,
  Shield,
  Wifi,
  ArrowRight,
} from "lucide-react";
import type { MetaFunction } from "react-router";

import { PageShell } from "~/components/layout";
import { CTASection, CtaButton, PageHero } from "~/components/site";
import { pageMeta } from "~/lib/seo";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () =>
  pageMeta({
    description:
      "Residential network support from Cadena Labs for advanced home WiFi, segmentation, and secure remote access projects in London, Ontario.",
    pathname: "/residential",
    title: "Residential | Cadena Labs",
  });

const offerings = [
  {
    icon: Wifi,
    title: "Home WiFi & Coverage",
    description:
      "For larger homes or more demanding setups that need better coverage, cleaner roaming, and more dependable performance.",
  },
  {
    icon: Shield,
    title: "Secure Home Networking",
    description:
      "Segment cameras, guest devices, and smart-home equipment so your primary devices stay cleaner and easier to protect.",
  },
  {
    icon: Lightbulb,
    title: "Smart Home & Automation",
    description:
      "Tie together lighting, sensors, and smart-home gear on a network that keeps automations responsive and devices easier to manage.",
  },
  {
    icon: HomeIcon,
    title: "Advanced Home Projects",
    description:
      "A good fit for homeowners who want business-grade thinking applied to a more advanced residential setup.",
  },
];

export default function Residential() {
  return (
    <PageShell>
      <main>
        <PageHero
          eyebrow="Residential"
          title="Advanced Home Infrastructure"
          description="Cadena Labs primarily serves small businesses, but advanced home network projects are still available for homeowners who need stronger WiFi, better segmentation, or a more secure setup."
        />

        <section className="container-page py-16 md:py-20">
          <div className="grid border-y border-border/70 md:grid-cols-2">
            {offerings.map((offering, idx) => (
              <div
                key={offering.title}
                className={cn(
                  "flex flex-col gap-4 border-border/70 py-8 md:px-8",
                  idx % 2 === 0 && "md:border-r",
                  idx < offerings.length - 2 && "md:border-b",
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground/5 text-foreground ring-1 ring-foreground/10">
                  <offering.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl">{offering.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {offering.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-page py-16 md:py-24 text-center">
          <div className="flex flex-col items-center gap-6">
            <h2 className="font-display text-3xl md:text-5xl">
              Need help with a residential network project?
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Submit project details through the contact form; Cadena Labs will
              confirm whether the work is a good fit and outline the next step.
            </p>
            <CtaButton href="/contact">
              Describe Your Setup
              <ArrowRight />
            </CtaButton>
          </div>
        </section>

        <CTASection />
      </main>
    </PageShell>
  );
}
