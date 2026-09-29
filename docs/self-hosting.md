# Run your own copy

This repository is MIT-licensed. You may clone or copy it and operate your own
marketing site on Cloudflare Workers without permission from Cadena Labs.

The production deployment described here is [cadenalabs.io](https://cadenalabs.io).
Replace Cadena-specific content, assets, and configuration with your own.

## Prerequisites

- Node.js `^20.19` or `>=22.12` (see `.node-version`)
- [pnpm](https://pnpm.io/) `10.33.0` (see `packageManager` in `package.json`)
- A Cloudflare account (Workers + custom domain)
- [Cloudflare Email Sending](https://developers.cloudflare.com/email-service/get-started/send-emails/)
  on Workers Paid, with an onboarded sender domain, and
  [Turnstile](https://developers.cloudflare.com/turnstile/) for the contact form

## Quick start

```sh
git clone https://github.com/cadena-labs/cadenalabs-io.git my-site
cd my-site
pnpm install
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your sender, destination, and Turnstile values
pnpm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Monorepo layout

This repo uses **pnpm workspaces** and **Turborepo**:

| Path                   | Role                                                     |
| ---------------------- | -------------------------------------------------------- |
| Repository root        | The marketing site (`app/`, `server/`, `vite.config.ts`) |
| `apps/*`, `packages/*` | Optional workspace slots if you grow the monorepo        |
| `turbo.json`           | Task graph for `check`, `build`, `lint`, etc.            |

CI and local development run from the **repository root** with `pnpm run dev` and
`pnpm run check`. Do not use npm or commit `package-lock.json`.

## What to change for your brand

Work through these in order:

1. **`app/lib/seo.ts`** — `siteUrl`, `siteName`, `defaultSeoDescription`
2. **`app/lib/schemas.ts`** — organization / local business JSON-LD
3. **`app/data/services.ts`** and **`app/data/blog.ts`** — your offerings and posts
4. **`app/components/layout.tsx`** — navigation, footer, social links
5. **`app/routes/*.tsx`** — page copy (home, about, contact, etc.)
6. **`public/images/`** — logo and favicon assets
7. **`public/og-image.png`** — run `pnpm run og:generate` after updating branding, or replace the file
8. **`wrangler.jsonc`** — Worker `name` and `routes` / `custom_domain` for your domain
9. **`.dev.vars`** — your email settings and Turnstile secrets (never commit this file)

Remove or rewrite Cadena-specific routes (`community`, `residential`) if they
do not apply to your business.

## Contact form secrets

Copy `.dev.vars.example` to `.dev.vars` and set:

- `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME`, `CONTACT_EMAIL`
- `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

`EMAIL_FROM_ADDRESS` must use a domain onboarded to Cloudflare Email Sending
in the Worker's account. Review the generated sending DNS records while
preserving your mailbox MX records and DMARC policy. No email API key is needed:
both Wrangler configs include the native `EMAIL` binding. Add your production
hostname to the Turnstile widget allowlist in the Cloudflare dashboard.

Local development simulates email delivery by default. To test real delivery,
temporarily set `remote: true` on the `EMAIL` entry in
`dev.wrangler.jsonc`, authenticate Wrangler, and use a controlled destination
inbox. Revert that change after testing. See the **Local email testing** section
in `README.md`.

## Deploy on Cloudflare

### Option A — Wrangler + manual secrets

```sh
pnpm run build:production
# Set secrets in the Cloudflare dashboard or:
# pnpm exec wrangler secret put EMAIL_FROM_ADDRESS --config dist/server/wrangler.json
# Repeat for EMAIL_FROM_NAME, CONTACT_EMAIL, TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY.
pnpm run deploy:built
```

Use `dist/server/wrangler.json` after build, or point Wrangler at your root
`wrangler.jsonc` depending on how you configure the project.

### Option B — 1Password Environments (how cadenalabs.io deploys)

Cadena Labs uses `pnpm run cloudflare:build` and `pnpm run cloudflare:deploy`
with `OP_SERVICE_ACCOUNT_TOKEN` and `OP_ENVIRONMENT_ID` in Workers Builds.
See the **Secrets** and **Cloudflare Git Deploys** sections in `README.md`.

You can ignore 1Password entirely and use dashboard secrets or
`wrangler secret put` instead.

## Production checklist

- [ ] Custom domain on the Worker; `www` redirects to apex if you use both
- [ ] Turnstile hostname allowlist includes your apex domain
- [ ] Cloudflare sender domain verified and sending quota reviewed
- [ ] Contact form delivers to your inbox; SPF/DKIM/DMARC pass; Reply targets the visitor
- [ ] WAF rate limiting on `POST /contact` (Cloudflare dashboard)
- [ ] `pnpm run check` passes before you deploy

## Upstream repository

Cadena Labs does not accept pull requests on
[cadena-labs/cadenalabs-io](https://github.com/cadena-labs/cadenalabs-io). See
[`CONTRIBUTING.md`](../CONTRIBUTING.md).
