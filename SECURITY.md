# Security Policy

## Reporting a Vulnerability

Please do not open a public issue with vulnerability details, proof-of-concept
code, secret values, customer data, or exploit steps.

Use GitHub's private vulnerability reporting for this repository when available.
If private reporting is not available, use the contact form at
https://cadenalabs.io/contact and ask for a security reporting channel without
including sensitive technical details in the first message.

Useful reports include:

- Affected route, file, dependency, or deployment surface.
- Clear reproduction steps.
- Expected and observed behavior.
- Security impact and any realistic abuse scenario.
- Whether the issue is already public or being actively exploited.

Cadena Labs Inc. will acknowledge valid reports as soon as practical, investigate
the impact, and coordinate any fix and disclosure timing with the reporter.

## Secrets

Never include live credentials, API keys, tokens, private keys, `.env` files, or
Cloudflare/1Password secret values in issues, pull requests, commits, screenshots,
or pasted logs.

## Workers Builds and pull requests

Production deploys on `main` use 1Password (`OP_SERVICE_ACCOUNT_TOKEN`,
`OP_ENVIRONMENT_ID`) during build and deploy. Non-production Workers Builds use
CI placeholder secrets only and must not have 1Password credentials configured
in the dashboard.

Do not change preview build or deploy commands to load 1Password or upload runtime
secrets unless you fully trust the branch. For maintainer-only previews with real
secrets, use `pnpm run cloudflare:preview:trusted` locally, not untrusted PR
automation.
