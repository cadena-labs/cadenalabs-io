import { Church, PawPrint, Users } from "lucide-react";
import type { MetaFunction } from "react-router";

import { PageShell } from "~/components/layout";
import { CTASection, PageHero, SectionIntro } from "~/components/site";
import { pageMeta } from "~/lib/seo";

export const meta: MetaFunction = () =>
  pageMeta({
    description:
      "Cadena Labs offers pro-bono IT and networking services for non-profit organizations in London, Ontario: churches, animal shelters, charities, and more.",
    pathname: "/community",
    title: "Community | Cadena Labs",
  });

const orgTypes = [
  {
    icon: Church,
    title: "Churches",
    description:
      "Local churches and Christian organizations that serve as community anchors.",
  },
  {
    icon: PawPrint,
    title: "Animal Shelters & Rescues",
    description:
      "Shelters and rescue organizations working to protect and rehome animals in the London region.",
  },
  {
    icon: Users,
    title: "Community Non-Profits",
    description:
      "Food banks, youth programs, community centres, and other registered non-profits making a local impact.",
  },
];

export default function Community() {
  return (
    <PageShell>
      <main>
        <PageHero
          eyebrow="Community"
          title="Giving Back"
          description="Non-profits do meaningful work with limited resources. Cadena Labs offers pro-bono IT and networking services so local organizations can focus on their mission instead of their technology."
        />

        <section className="container-page py-16 md:py-20">
          <SectionIntro
            eyebrow="Eligible organizations"
            title="Organizations Cadena Labs supports"
          />
          <div className="ruled-grid md:grid-cols-3">
            {orgTypes.map((org) => (
              <div key={org.title} className="flex flex-col gap-4 py-8 md:px-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground/5 text-foreground ring-1 ring-foreground/10">
                  <org.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl">{org.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {org.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-page py-16 md:py-24">
          <SectionIntro eyebrow="Services" title="How Cadena Labs can help">
            <div className="space-y-4">
              <p>
                Whether you need a reliable WiFi network for your community
                hall, security cameras for your shelter, or a second opinion on
                your current setup, pro-bono support may be available at no
                cost.
              </p>
              <p>
                Services are offered on a case-by-case basis depending on scope
                and availability. Contact Cadena Labs to discuss fit, timing,
                and how support can be structured.
              </p>
            </div>
          </SectionIntro>
        </section>

        <CTASection
          title="Running a non-profit?"
          body="Send a short description of your organization and what you need. Cadena Labs will follow up to discuss fit, scope, and timing."
          label="Reach out"
        />
      </main>
    </PageShell>
  );
}
