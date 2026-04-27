#!/usr/bin/env bash
# Runs a command with a 1Password Environment injected by op.

set -euo pipefail

if [[ -z "${OP_ENVIRONMENT_ID:-}" ]]; then
  echo "with-op-environment: OP_ENVIRONMENT_ID is not set." >&2
  echo "with-op-environment: set it as a Cloudflare build variable or export it before running this script locally." >&2
  exit 1
fi

if [[ ! -x "./bin/op" ]]; then
  echo "with-op-environment: missing ./bin/op. Run scripts/install-op.sh first." >&2
  exit 1
fi

exec ./bin/op run --environment "$OP_ENVIRONMENT_ID" -- "$@"
