import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { LinksFunction } from "react-router";
import type * as React from "react";

import { Button } from "~/components/ui/button";

import styles from "./app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico", sizes: "any" },
  {
    rel: "icon",
    type: "image/png",
    href: "/images/cadenalabs-favicon-64x64.png",
    sizes: "64x64",
  },
  {
    rel: "apple-touch-icon",
    href: "/images/cadenalabs-favicon-512x512.png",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "Something went wrong";

  return (
    <main className="container-page flex min-h-screen flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="eyebrow">Cadena Labs</p>
      <h1 className="text-4xl sm:text-6xl">{message}</h1>
      <p className="max-w-md text-muted-foreground">
        Something on the wire didn&apos;t respond as expected. Head back to home
        or try again in a moment.
      </p>
      <Button asChild size="lg" className="h-11 px-5 text-sm">
        <Link to="/">Return home</Link>
      </Button>
    </main>
  );
}
