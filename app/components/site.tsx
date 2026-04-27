import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type * as React from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type SmartLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function SmartLink({ href, children, className }: SmartLinkProps) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link className={className} to={href}>
      {children}
    </Link>
  );
}

type CtaButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "brand" | "default" | "outline" | "secondary";
  size?: "default" | "lg";
  className?: string;
};

export function CtaButton({
  href,
  children,
  variant = "brand",
  size = "lg",
  className,
}: CtaButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn("h-11 px-5 text-sm", className)}
    >
      <SmartLink href={href}>{children}</SmartLink>
    </Button>
  );
}

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-border/70 bg-card/60 px-3 py-1 text-[0.7rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase",
        className,
      )}
    >
      {children}
    </Badge>
  );
}

type SectionIntroProps = {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  children?: React.ReactNode;
  className?: string;
};

export function SectionIntro({
  eyebrow,
  title,
  align = "left",
  children,
  className,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4",
        align === "center" && "mx-auto max-w-2xl items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-balance text-3xl font-display sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {children ? (
        <div className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          {children}
        </div>
      ) : null}
    </div>
  );
}

type CTASectionProps = {
  title?: string;
  body?: string;
  label?: string;
  href?: string;
  className?: string;
};

export function CTASection({
  title = "Need clearer direction on infrastructure or security?",
  body = "Send an inquiry through the contact form. Cadena Labs will walk through the current setup, constraints, and the most practical next move.",
  label = "Send an inquiry",
  href = "/contact",
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "border-y border-border/60 bg-card/35 py-16 md:py-20",
        className,
      )}
    >
      <div className="container-page">
        <span aria-hidden="true" className="gradient-hairline mb-8 max-w-24" />
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
          <div className="space-y-4">
            <Eyebrow>Next Step</Eyebrow>
            <h2 className="text-balance text-3xl font-display sm:text-4xl">
              {title}
            </h2>
            <p className="max-w-xl text-base text-muted-foreground">{body}</p>
          </div>
          <div className="flex md:justify-end">
            <CtaButton href={href}>
              {label}
              <ArrowRight />
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: PageHeroProps) {
  return (
    <section className="container-page pb-12 pt-16 md:pb-16 md:pt-24">
      <div className="flex flex-col gap-6">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-balance text-4xl font-display leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
