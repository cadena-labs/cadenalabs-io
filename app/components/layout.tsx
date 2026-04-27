import { Facebook, TikTokDark, XDark } from "@ridemountainpig/svgl-react";
import { Menu } from "lucide-react";
import { Link, NavLink } from "react-router";
import { useState } from "react";
import type * as React from "react";
import type { SVGProps } from "react";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/community", label: "Community" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const footerItems = [
  { href: "/services", label: "Services" },
  { href: "/community", label: "Community" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/residential", label: "Residential" },
  { href: "/contact", label: "Contact" },
];

type SocialIcon = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

export const socialLinks: {
  href: string;
  label: string;
  Icon: SocialIcon;
}[] = [
  {
    href: "https://www.facebook.com/profile.php?id=61585080770380",
    label: "Facebook",
    Icon: Facebook,
  },
  { href: "https://x.com/Cadena_Labs", label: "X", Icon: XDark },
  {
    href: "https://www.tiktok.com/@cadenalabs",
    label: "TikTok",
    Icon: TikTokDark,
  },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          aria-label="Cadena Labs home"
          className="flex items-center gap-2.5 text-sm tracking-tight"
        >
          <img
            src="/images/cadenalabs-favicon-512x512.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
          <span className="font-wordmark text-base font-bold tracking-tight">
            Cadena Labs
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} end={false}>
              {({ isActive }) => (
                <span
                  className={cn(
                    "relative inline-flex h-9 items-center px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "bg-brand-gradient absolute inset-x-3 -bottom-0.5 h-px rounded-full transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="brand" size="lg" className="h-9 px-4">
            <Link to="/contact">Send an inquiry</Link>
          </Button>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <SheetHeader className="border-b border-border/60 px-6 py-5">
              <SheetTitle className="font-wordmark text-base font-bold tracking-tight">
                Cadena Labs
              </SheetTitle>
            </SheetHeader>
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 px-3 py-4"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                >
                  {({ isActive }) => (
                    <span
                      className={cn(
                        "relative flex h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "bg-brand-gradient absolute inset-y-2 left-0 w-0.5 rounded-full transition-opacity duration-200",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {item.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
            <Separator />
            <div className="flex items-center justify-center gap-1 px-6 py-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
            <Separator />
            <div className="px-6 py-4">
              <Button
                asChild
                variant="brand"
                className="h-10 w-full"
                onClick={() => setMobileOpen(false)}
              >
                <Link to="/contact">Send an inquiry</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/40">
      <div className="container-page flex flex-col gap-12 py-12 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4 max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5 text-base">
            <img
              src="/images/cadenalabs-favicon-512x512.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <span className="font-wordmark font-bold tracking-tight">
              Cadena Labs
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Small-business IT, infrastructure planning, and security baselines.
            Cadena Labs applies technical depth to your systems. Based in
            London, Ontario.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3 md:gap-x-16"
        >
          {footerItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Cadena Labs. All rights reserved.</p>
          <p>London, Ontario · Canada</p>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
