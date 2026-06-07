#!/usr/bin/env bash
# Runs a command with a 1Password Environment injected by op.

set -euo pipefail

OP_ENVIRONMENT_ID="${OP_ENVIRONMENT_ID:-${CADENALABS_DEV_1PASSWORD_ENVIRONMENT_ID:-}}"

if [[ -z "$OP_ENVIRONMENT_ID" ]]; then
  echo "with-op-environment: no 1Password Environment ID is set." >&2
  echo "with-op-environment: export CADENALABS_DEV_1PASSWORD_ENVIRONMENT_ID for local development, or set OP_ENVIRONMENT_ID as a Cloudflare build variable for Workers Builds." >&2
  exit 1
fi

export OP_ENVIRONMENT_ID

if [[ ! -x "./bin/op" ]]; then
  echo "with-op-environment: missing ./bin/op. Run scripts/install-op.sh first." >&2
  exit 1
fi

exec ./bin/op run --environment "$OP_ENVIRONMENT_ID" -- "$@"
