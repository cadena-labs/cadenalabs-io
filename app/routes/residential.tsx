import { Home as HomeIcon, Lightbulb, Shield, Wifi } from "lucide-react";
import type { MetaFunction } from "react-router";

import { PageShell } from "~/components/layout";
import { CTASection, PageHero } from "~/components/site";
import { pageMeta } from "~/lib/seo";

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
          <div className="ruled-grid md:grid-cols-2">
            {offerings.map((offering) => (
              <div
                key={offering.title}
                className="flex flex-col gap-4 py-8 md:px-8"
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

        <CTASection
          title="Need help with a residential network project?"
          body="Describe your home and what is not working. Cadena Labs will confirm whether it is a good fit and outline the next step."
          label="Describe your setup"
        />
      </main>
    </PageShell>
  );
}
