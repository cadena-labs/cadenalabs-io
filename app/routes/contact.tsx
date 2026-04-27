import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { PageShell } from "~/components/layout";
import { Eyebrow, PageHero } from "~/components/site";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { handleContactAction } from "~/lib/contact.server";
import { pageMeta } from "~/lib/seo";

export const meta: MetaFunction = () =>
  pageMeta({
    description:
      "Contact Cadena Labs with a written inquiry—networking, security, servers, cloud, procurement, and small-business IT in London, Ontario.",
    pathname: "/contact",
    title: "Contact | Cadena Labs",
  });

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: "auto" | "dark" | "light";
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: TurnstileRenderOptions,
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export function loader({ context }: LoaderFunctionArgs) {
  return {
    turnstileSiteKey: context.cloudflare.env.TURNSTILE_SITE_KEY,
  };
}

export const action = handleContactAction;

const bestFitItems = [
  "5-50 person teams",
  "Single and multi-site small businesses",
  "Offices planning network, WiFi, or server upgrades",
  "Teams dealing with access, security, or reliability issues",
];

export default function Contact() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const { turnstileSiteKey } = useLoaderData<typeof loader>();
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);

  const isSubmitting =
    navigation.state === "submitting" && navigation.formMethod === "POST";

  useEffect(() => {
    let cancelled = false;

    function renderTurnstile() {
      if (
        cancelled ||
        !turnstileContainerRef.current ||
        !window.turnstile ||
        widgetIdRef.current
      ) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(
        turnstileContainerRef.current,
        {
          "error-callback": () => setTurnstileError(true),
          "expired-callback": () => {
            if (widgetIdRef.current) {
              window.turnstile?.reset(widgetIdRef.current);
            }
          },
          callback: () => setTurnstileError(false),
          sitekey: turnstileSiteKey,
          theme: "dark",
        },
      );
    }

    if (window.turnstile) {
      renderTurnstile();
    } else {
      const script = document.querySelector<HTMLScriptElement>(
        'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]',
      );

      script?.addEventListener("load", renderTurnstile, { once: true });
    }

    return () => {
      cancelled = true;

      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [turnstileSiteKey]);

  return (
    <PageShell>
      <main>
        <PageHero
          eyebrow="Contact"
          title="Send an inquiry."
          description="Best for small businesses with questions on networking, security, servers, cloud, backups, procurement, or overall infrastructure—whatever matters most right now."
        />

        <section className="container-page grid gap-6 pb-16 md:grid-cols-[1.4fr_1fr] md:gap-8">
          {actionData?.ok === true ? (
            <Card
              role="status"
              aria-live="polite"
              className="ring-foreground/[0.07] animate-in fade-in zoom-in-95 duration-500"
            >
              <CardContent className="space-y-6 px-6 py-10 md:px-8 md:py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 ring-1 ring-foreground/10">
                  <CheckCircle2
                    className="h-6 w-6 text-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-3">
                  <h2 className="font-display text-2xl">Inquiry sent</h2>
                  <p className="text-sm text-muted-foreground">
                    {actionData.message}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cadena Labs typically replies within one business day. Watch
                    for a reply at the email address you provided.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="ring-foreground/[0.07]">
              <CardContent className="space-y-6 px-6 py-7 md:px-8 md:py-8">
                <div className="space-y-2">
                  <h2 className="font-display text-2xl">
                    Describe your environment
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Messages are reviewed on business days; Cadena Labs
                    typically responds within one business day.
                  </p>
                </div>

                <Form
                  method="post"
                  className="space-y-5"
                  aria-busy={isSubmitting}
                >
                  <fieldset
                    disabled={isSubmitting}
                    className="space-y-5 border-0 p-0 transition-opacity disabled:opacity-60"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="contact-name">Name</Label>
                      <Input
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        required
                        className="h-10"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="h-10"
                        placeholder="you@company.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-message">What is going on?</Label>
                      <Textarea
                        id="contact-message"
                        name="message"
                        rows={6}
                        required
                        className="min-h-32"
                        placeholder="Server refresh planning, WiFi drops in the office, VPN and remote access, backup gaps, UniFi rollout, security baseline..."
                      />
                    </div>

                    <input
                      aria-hidden="true"
                      autoComplete="off"
                      className="absolute left-[-10000px] h-[1px] w-[1px] opacity-0"
                      name="website"
                      tabIndex={-1}
                    />

                    <div
                      ref={turnstileContainerRef}
                      className="min-h-[65px] flex items-start"
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Button
                        type="submit"
                        variant="brand"
                        size="lg"
                        className="h-11 px-5 text-sm"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Inquiry"}
                        <Send />
                      </Button>
                      <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ShieldCheck
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        Protected by Turnstile
                      </p>
                    </div>
                  </fieldset>

                  {turnstileError ? (
                    <Alert variant="destructive">
                      <AlertCircle />
                      <AlertTitle>Verification could not load</AlertTitle>
                      <AlertDescription>
                        Refresh the page and try again, or submit the form once
                        verification loads.
                      </AlertDescription>
                    </Alert>
                  ) : actionData?.ok === false ? (
                    <Alert variant="destructive">
                      <AlertCircle />
                      <AlertTitle>Message not sent</AlertTitle>
                      <AlertDescription>{actionData.message}</AlertDescription>
                    </Alert>
                  ) : null}
                </Form>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col gap-4">
            <Card className="overflow-hidden bg-card/80 ring-foreground/[0.12]">
              <CardContent className="space-y-5 px-6 py-7 md:px-7">
                <Eyebrow className="inline-flex items-center gap-1.5">
                  <CalendarClock className="h-3 w-3" aria-hidden="true" />
                  What to expect
                </Eyebrow>
                <h2 className="font-display text-2xl">
                  One form, no public inbox
                </h2>
                <p className="text-sm text-muted-foreground">
                  Inquiries stay on this page. Cadena Labs replies by email to
                  the address you submit—there is no published contact address
                  on the site.
                </p>
                <Separator className="bg-border/60" />
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Scoped follow-up when it is a fit
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Reply within one business day
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    London, Ontario, Canada
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="ring-foreground/[0.07]">
              <CardContent className="space-y-4 px-6 py-6">
                <Eyebrow>Best Fit</Eyebrow>
                <h3 className="font-display text-lg">A great fit for</h3>
                <ul className="space-y-2.5">
                  {bestFitItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <script
        async
        defer
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      />
    </PageShell>
  );
}
