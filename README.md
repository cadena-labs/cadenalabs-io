# Cadena Labs

[![Check](https://github.com/cadena-labs/cadenalabs-io/actions/workflows/check.yml/badge.svg)](https://github.com/cadena-labs/cadenalabs-io/actions/workflows/check.yml)
[![CodeQL](https://github.com/cadena-labs/cadenalabs-io/actions/workflows/codeql.yml/badge.svg)](https://github.com/cadena-labs/cadenalabs-io/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-24-339933?logo=node.js&logoColor=white)](.node-version)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/workers/)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fcadenalabs.io&label=cadenalabs.io)](https://cadenalabs.io)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff?logo=pnpm&logoColor=white)](https://pnpm.io/)

Open-source marketing site for [Cadena Labs](https://cadenalabs.io) (London,
Ontario): React Router v7, Tailwind v4, shadcn/ui, contact form (Cloudflare Email Service +
Turnstile), deployed on Cloudflare Workers with Workers Static Assets.

The code is [MIT licensed](LICENSE) so anyone can read, verify, and run their
own copy. Cadena Labs does not accept pull requests on this repository — see
[`CONTRIBUTING.md`](CONTRIBUTING.md).

**[Run your own copy →](docs/self-hosting.md)**

Production deploys use 1Password Environments for runtime secrets (see
[`docs/self-hosting.md`](docs/self-hosting.md) for a manual-secrets path).

## Monorepo (pnpm + Turborepo)

- **Package manager:** pnpm only (`packageManager` in `package.json`). Use
  `pnpm install` / `pnpm run …`. Do not use npm or commit `package-lock.json`.
- **Workspaces:** `pnpm-workspace.yaml` includes the repo root, `apps/*`, and
  `packages/*`. The site app lives at the root today; extra workspace globs are
  available if you split packages out later.
- **Task runner:** Turborepo (`turbo.json`) orchestrates `format:check`, `lint`,
  `typecheck`, `test`, and `build` when you run `pnpm run check`.

## Open source

This repository is maintained by Cadena Labs for [cadenalabs.io](https://cadenalabs.io).
We do not review feature or tooling pull requests here. Security issues should
follow [`SECURITY.md`](SECURITY.md). Problems on the live site can be reported
via GitHub issues (see [`CONTRIBUTING.md`](CONTRIBUTING.md)).

## Commands

```sh
pnpm run dev:op
pnpm run dev
pnpm run check
pnpm run lint
pnpm run format
pnpm run typecheck
pnpm run build
pnpm run preview
pnpm run cloudflare:build
pnpm run cloudflare:deploy
pnpm run secrets:sync:1password
pnpm run deploy:1password
```

`pnpm run check` is the CI parity command. It runs formatting checks, linting,
type generation/typechecking, a production build, and a production dependency
audit. Local maintainer runs use `op run` via `dev:op`; CI does not commit or
read plaintext env files.

`pnpm run typecheck` regenerates React Router route types and Wrangler
`worker-configuration.d.ts` from `dev.wrangler.jsonc` (`wrangler types --env-file
/dev/null`) before running `tsc --noEmit`.

## Repository layout

- Source lives under `app/`, Workers entrypoint code under `server/`, and
  operational scripts under `scripts/`.
- Blog/service content currently lives in typed data modules under `app/data/`.
  Do not add a second content source unless the app is wired to read it.
- shadcn/ui components are source-owned under `app/components/ui/`; shared site
  primitives live in `app/components/site.tsx`.
- Generated output and local runtime state are ignored: top-level `/dist/`,
  `.react-router/`, `.wrangler/`, `bin/`, and local `.dev.vars` files. Do not
  commit `dist/` even if a tool suggests adding untracked files in bulk.
- GitHub Actions runs `pnpm install --frozen-lockfile` and `pnpm run check` on
  pushes to `main`.
- `dev.wrangler.jsonc` is the committed local-development Wrangler config.
  `wrangler.jsonc` adds production routes and is used for production builds
  (`build:production`). `worker-configuration.d.ts` is generated from
  `dev.wrangler.jsonc`. Rerun `pnpm run wrangler:types` after changing bindings
  or secrets in Wrangler config.

## Cloudflare Workers Paid

This project is configured for the Workers Paid plan / Standard usage model:

- Workers Static Assets serve `dist/client` through the `ASSETS` binding.
- Observability logs and traces stay on with 25% head sampling at launch and dashboard
  persistence; invocation logs stay off. Lower sampling in `wrangler.jsonc` if traffic
  or cost grows.
- The Worker wrapper logs structured JSON only for unhandled request errors.
- A `10_000ms` CPU limit is set to cap accidental runaway SSR work.

Workers Trace Events Logpush is Paid-plan-only, but it still needs a destination
such as R2, S3, or an observability provider before it can be configured here.
Once that destination exists, add it under `observability.logs.destinations` or
`observability.traces.destinations`.

## Secrets

Secrets are managed with 1Password Environments as the source of truth.

**Local dev (maintainers).** Resolve the Environment ID once, export it for the
shell session (or your profile), unlock the 1Password desktop app with CLI
integration enabled, then inject secrets with `op run`:

1. **Resolve the ID** for the Environment named `cadenalabs-io`:
   - **Cursor / agents:** 1Password Environments MCP — `authenticate`, then
     `list_environments`; use the `environmentId` for that Environment. Confirm
     variable names with `list_variables` (names only).
   - **1Password desktop:** Developer → Environments → `cadenalabs-io` → Manage
     environment → Copy environment ID.
2. **Run dev** (do not commit the ID; add the export to your shell profile if
   you want it persistent locally):

```sh
export CADENALABS_DEV_1PASSWORD_ENVIRONMENT_ID="<environment-id>"
pnpm run dev:op
```

`dev:op` runs `react-router dev` inside `op run --environment` and passes
injected values to the Worker through `process.env`. `dev.wrangler.jsonc`
declares `secrets.required` so Wrangler loads the allowlist from the process
environment when no `.dev.vars` file is present. Do **not** mount a 1Password
local `.dev.vars` FIFO while the Vite dev server is running; it can cause
restart loops and conflicts with multi-read startup.

Use `pnpm run preview:op` to test the production build the same way.

The Vite dev server binds to `0.0.0.0:3333` (`vite.config.ts`) so you can reach
the site from another device on a trusted LAN or from a container. On untrusted
networks, set `server.host` to `"127.0.0.1"` in `vite.config.ts` (or remove
`host` to use the Vite default) for loopback-only access.

If you are not using 1Password locally, copy the Workers local-dev example and
fill it with local or test values:

```sh
cp .dev.vars.example .dev.vars
pnpm run dev
```

Wrangler reads plaintext `.dev.vars` directly for forks and ad hoc testing.
Keep that file gitignored.

Use preview only when you want to test the built output:

```sh
pnpm run preview
```

Copied secret files are ignored by git. Do not commit plaintext secret files.
The Environment should define:

- `EMAIL_FROM_ADDRESS` - sender address on a domain onboarded to Cloudflare Email Sending (not committed)
- `EMAIL_FROM_NAME` - display name for outbound mail (not committed)
- `CONTACT_EMAIL` - inbox that receives contact submissions
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

`EMAIL_FROM_ADDRESS` must use a domain onboarded to Cloudflare Email Sending
in the same account as the Worker. These values are Worker runtime secrets only;
they are not checked into the repository. The `EMAIL` binding is configured in
both Wrangler files; no email API key or SDK is required.

## Cloudflare Email Service

The contact form awaits `env.EMAIL.send()` and sends both HTML and plain text
to `CONTACT_EMAIL`, with the visitor's address as `replyTo`. Success means the
provider accepted the message, not that it reached the inbox. Rejected sends
return the existing form error without retries or fallback. Worker logs include
`contact_email_accepted` with a message ID or `contact_email_error` with an
available provider error code; submission content is excluded.

Before deploying, confirm Email Sending is available in the Worker's account,
review its sending quota, and onboard the sender domain under **Compute →
Email Service → Email Sending**. Review the generated bounce-subdomain MX, SPF,
and DKIM records, preserving your receiving mailbox's MX records and existing
DMARC policy. Email Sending is separate from inbound Email Routing; this site
does not need a Worker `email()` handler.

Cadena Labs sends from `mail.cadenalabs.io`. Onboard that subdomain by selecting
the `cadenalabs.io` zone and entering `mail` as the subdomain. Its sending
records belong under `cf-bounce.mail.cadenalabs.io` and
`cf-bounce._domainkey.mail.cadenalabs.io`; its DMARC record belongs at
`_dmarc.mail.cadenalabs.io`. Preserve the apex Google Workspace MX records
and `_dmarc.cadenalabs.io` policy.

See [domain setup](https://developers.cloudflare.com/email-service/configuration/domains/)
and [sending limits](https://developers.cloudflare.com/email-service/platform/limits/).

### Local email testing

Both committed configs omit `remote: true`, so local development simulates
email sending. Simulated messages are logged and saved locally for inspection;
use synthetic inquiries. CI uses placeholder settings and mocked bindings.

For a real delivery test, temporarily change only `dev.wrangler.jsonc`:

```jsonc
"send_email": [{ "name": "EMAIL", "remote": true }]
```

Authenticate Wrangler to the correct Cloudflare account, inject an onboarded
sender and a controlled test `CONTACT_EMAIL`, and run `pnpm run dev:op`.
This sends real mail. Complete the form and check receipt and Reply behavior,
then revert the temporary config change. Keep production builds on
`wrangler.jsonc`.

See [local development](https://developers.cloudflare.com/email-service/local-development/sending/).

### Resend migration and rollback

1. In the 1Password Environment, add `EMAIL_FROM_ADDRESS` with the existing
   `RESEND_FROM_EMAIL` value and `EMAIL_FROM_NAME` with the existing
   `RESEND_FROM_NAME` value. Retain the original settings and `RESEND_API_KEY`
   for rollback; the new deployment allowlist excludes them.
2. Verify the Cloudflare sender domain and quota before pushing the change to
   `main`. Record the current production Worker version and deployment ID.
3. Deploy through the existing main-branch Workers Builds pipeline. Submit a
   controlled inquiry through production with Turnstile verification. Confirm
   inbox receipt, SPF/DKIM/DMARC results, and that Reply targets the visitor.
4. Check [Email Sending activity](https://developers.cloudflare.com/email-service/observability/logs/)
   after cutover and repeat a controlled submission after 24 hours. Worker logs
   are sampled; use email activity and the receiving inbox to confirm delivery.
   Restore the recorded Worker version if sending fails, retaining the original
   Resend credentials and sender DNS records throughout the rollback window.
   If the Resend domain has already been deleted, re-add and verify it before
   restoring a Resend-based version.
5. After seven stable days, revoke this site's Resend API key, remove the old
   Resend settings from 1Password and current Worker secrets, and remove DNS
   records used exclusively by this integration. Delete the Resend domain only
   if no other application uses it. Preserve shared mailbox and DNS records.

## Cloudflare Git Deploys

Cloudflare Workers Builds should run from the repository root with these
settings:

- **Production branch:** `main` only
- **Builds for non-production branches:** disabled
- **Build command:** `pnpm run cloudflare:build`
- **Deploy command:** `pnpm run cloudflare:deploy`
- **Node version:** `.node-version` selects Node `24` LTS

Pull requests are validated in GitHub Actions (`pnpm run check`) with CI
placeholder secrets only. Cloudflare does not build or deploy untrusted branches.

After deploy, verify the contact form, Turnstile on your production hostname,
and that `www` redirects to your apex domain if you use both.

### 1Password on production

Workers Builds exposes build variables and secrets only during the build; those
values are not runtime bindings. Production therefore uses the 1Password
Environment twice:

1. `cloudflare:build` on `main` runs the React Router / Cloudflare Vite build
   inside `op run`, validates the required runtime secret allowlist is present,
   and then builds the bundle with those values available.
2. `cloudflare:deploy` runs Wrangler inside `op run`, writes the explicit
   runtime secret allowlist to a temporary `0600` JSON file, passes that file to
   `wrangler deploy --secrets-file`, and deletes the file immediately after
   Wrangler exits.

In Cloudflare **build** settings, configure only these build-time secrets for
production (`main`):

- `OP_SERVICE_ACCOUNT_TOKEN` - scoped read-only access to the 1Password
  Environment
- `OP_ENVIRONMENT_ID` - the Environment ID to load

`OP_ENVIRONMENT_ID` must be set before `op run` starts. The Cloudflare pnpm
scripts fail fast if it is missing so production builds cannot accidentally
proceed without 1Password Environment injection. The 1Password Environment must
include the same runtime secret allowlist listed under **Secrets** above.

The Cloudflare-generated Workers Builds API token is enough for the deploy
command unless you choose to override it in the dashboard.

**Manual production deploys.** The deployment system should store only:

- `OP_SERVICE_ACCOUNT_TOKEN` - scoped read-only access to the 1Password Environment
- `OP_ENVIRONMENT_ID` - the Environment ID to load

Build/deploy injection follows the same pattern:

1. `scripts/install-op.sh` downloads a pinned 1Password CLI beta into `./bin/op`.
2. The installer verifies the downloaded archive against pinned SHA-256 values.
3. `scripts/with-op-environment.sh` requires `OP_ENVIRONMENT_ID` and runs the
   command with the 1Password Environment injected.
4. `pnpm run cloudflare:build` validates the required runtime secrets and injects
   the 1Password Environment for build time.
5. `pnpm run cloudflare:deploy` injects the 1Password Environment again and
   uploads runtime secrets with the Worker version.

Cloudflare Workers cannot run the 1Password JavaScript SDK at runtime today, so
the Worker reads Cloudflare-bound secret copies. 1Password remains the source of
truth; Cloudflare receives only the small runtime allowlist during deploy.
