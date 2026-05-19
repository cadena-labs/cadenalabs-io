# Cadena Labs

[![Check](https://github.com/cadena-labs/cadenalabs-io/actions/workflows/check.yml/badge.svg)](https://github.com/cadena-labs/cadenalabs-io/actions/workflows/check.yml)
[![CodeQL](https://github.com/cadena-labs/cadenalabs-io/actions/workflows/codeql.yml/badge.svg)](https://github.com/cadena-labs/cadenalabs-io/actions/workflows/codeql.yml)
[![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/cadena-labs/cadenalabs-io?utm_source=oss&utm_medium=github&utm_campaign=cadena-labs%2Fcadenalabs-io&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)](https://coderabbit.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-24-339933?logo=node.js&logoColor=white)](.node-version)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/workers/)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fcadenalabs.io&label=cadenalabs.io)](https://cadenalabs.io)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff?logo=pnpm&logoColor=white)](https://pnpm.io/)

Open-source marketing site for [Cadena Labs](https://cadenalabs.io) (London,
Ontario): React Router v7, Tailwind v4, shadcn/ui, contact form (Resend +
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
pnpm run dev
pnpm run check
pnpm run lint
pnpm run format
pnpm run typecheck
pnpm run build
pnpm run preview
pnpm run cloudflare:build
pnpm run cloudflare:deploy
pnpm run cloudflare:preview
pnpm run secrets:sync:1password
pnpm run deploy:1password
```

`pnpm run check` is the CI parity command. It runs formatting checks, linting,
type generation/typechecking, a production build, and a production dependency
audit. Keep the local 1Password `.dev.vars` mount available for local runs; CI
does not commit or read plaintext env files.

`pnpm run typecheck` regenerates React Router route types and a slim Wrangler
`Env` declaration (`wrangler types --include-runtime false`) before running
`tsc --noEmit`. Full Workers runtime types are omitted from the repo on purpose.

## Repository layout

- Source lives under `app/`, Workers entrypoint code under `server/`, and
  operational scripts under `scripts/`.
- Blog/service content currently lives in typed data modules under `app/data/`.
  Do not add a second content source unless the app is wired to read it.
- shadcn/ui components are source-owned under `app/components/ui/`; shared site
  primitives live in `app/components/site.tsx`.
- Generated output and local runtime state are ignored: top-level `/dist/`,
  `.react-router/`, `.wrangler/`, `bin/`, and mounted `.dev.vars` files. Do not
  commit `dist/` even if a tool suggests adding untracked files in bulk.
- GitHub Actions runs `pnpm install --frozen-lockfile` and `pnpm run check` on
  pushes to `main`.
- `wrangler.jsonc` is the source Cloudflare config. `worker-configuration.d.ts`
  holds generated `Env` bindings only (~25 lines); `cloudflare-globals.d.ts`
  pulls in `@cloudflare/workers-types` for `Fetcher`, `ExportedHandler`, etc.
  Rerun `pnpm run wrangler:types` after changing bindings or secrets in Wrangler
  config.
- The pnpm scripts also generate the Cloudflare Vite plugin's relative-path config
  under ignored `.wrangler/` at runtime.

## Cloudflare Workers Paid

This project is configured for the Workers Paid plan / Standard usage model:

- Workers Static Assets serve `dist/client` through the `ASSETS` binding.
- Observability logs stay on with low head sampling and dashboard persistence;
  invocation logs stay off to keep volume down as traffic grows.
- Workers traces are disabled for this marketing site (enable selectively when
  debugging performance).
- The Worker wrapper logs structured JSON only for unhandled request errors.
- A `10_000ms` CPU limit is set to cap accidental runaway SSR work.

Workers Trace Events Logpush is Paid-plan-only, but it still needs a destination
such as R2, S3, or an observability provider before it can be configured here.
Once that destination exists, add it under `observability.logs.destinations` or
`observability.traces.destinations`.

## Secrets

Secrets are managed with 1Password Environments as the source of truth.

**Local dev.** Mount the 1Password Environment to `.dev.vars` from the
1Password desktop app, then run the Vite dev server:

```sh
pnpm run dev
```

If you are not using 1Password locally, copy the Workers local-dev example and
fill it with local or test values:

```sh
cp .dev.vars.example .dev.vars
pnpm run dev
```

1Password mounts local env files as named pipes. Cloudflare's Vite plugin reads
Wrangler secrets more than once during startup, so the pnpm scripts first read
`.dev.vars` once and pass the values to the Worker runtime through
`process.env`. This keeps local behavior aligned with Cloudflare's secret
loading without writing plaintext secrets into `dist/server`. Existing
environment variables take precedence over `.dev.vars`, so `op run` and
Cloudflare build variables cannot be overwritten by the local mount.

Use preview only when you want to test the built output:

```sh
pnpm run preview
```

Mounted and copied secret files are ignored by git. Do not commit plaintext
secret files.
The Environment should define:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` - verified sender address in Resend (not committed)
- `RESEND_FROM_NAME` - display name for outbound mail (not committed)
- `CONTACT_EMAIL` - inbox that receives contact submissions
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

`RESEND_FROM_EMAIL` must use a domain verified in Resend. These values are
Worker runtime secrets only; they are not checked into the repository.

## Cloudflare Git Deploys

Cloudflare Workers Builds should run from the repository root with these
settings:

- Build command: `pnpm run cloudflare:build` (branch-aware; see below)
- Deploy command: `pnpm run cloudflare:deploy`
- Non-production branch deploy command: `pnpm run cloudflare:preview`
- Node version: `.node-version` selects Node `24` LTS

After deploy, verify the contact form, Turnstile on your production hostname,
and that `www` redirects to your apex domain if you use both.

### Production vs preview builds

Workers Builds uses one **build command** for every branch. `pnpm run
cloudflare:build` reads `WORKERS_CI_BRANCH` and chooses the path:

| Branch              | Build                                                      | Deploy (non-prod command)     |
| ------------------- | ---------------------------------------------------------- | ----------------------------- |
| `main` (production) | 1Password via `op run`, then `build:with-required-secrets` | `pnpm run cloudflare:deploy`  |
| Any other branch    | CI placeholder secrets only (no 1Password)                 | `pnpm run cloudflare:preview` |

Preview builds must not receive `OP_SERVICE_ACCOUNT_TOKEN` or
`OP_ENVIRONMENT_ID`. The preview deploy command uploads a Worker version **without**
`--secrets-file`; contact and Turnstile on preview URLs are not production-safe.

For a trusted preview with real secrets (local or manual only), use `pnpm run
cloudflare:preview:trusted` after `pnpm run cloudflare:build` on a branch you
control.

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
