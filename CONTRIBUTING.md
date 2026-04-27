# Contributing

This repository is the open-source codebase for
[cadenalabs.io](https://cadenalabs.io), maintained by Cadena Labs Inc.

## Pull requests

**We do not accept pull requests** on this repository — not for features, copy,
design, tooling changes, or dependency bumps from outside the organization.
Cadena Labs ships changes to `main` directly.

If you want to build on this stack, clone or copy the repo under the
[MIT License](LICENSE) and work in your own repository. See
[`docs/self-hosting.md`](docs/self-hosting.md).

## Issues

GitHub issues are limited to **bugs on the live site** or in the published
codebase (broken pages, accessibility problems, incorrect public documentation).
Use the bug report issue form.

Please do **not** open issues for:

- Feature requests or new pages for cadenalabs.io
- Business inquiries or project quotes
- Changes you want merged upstream (we do not accept PRs)

For prospective client work, use the contact form at
[cadenalabs.io/contact](https://cadenalabs.io/contact).

## Security

Do not file public issues for vulnerabilities. See [`SECURITY.md`](SECURITY.md)
for private reporting.

## Running the site locally

```sh
cp .dev.vars.example .dev.vars
pnpm install
pnpm run dev
```

Maintainers run the same checks as CI before pushing to `main`:

```sh
pnpm run check
```
