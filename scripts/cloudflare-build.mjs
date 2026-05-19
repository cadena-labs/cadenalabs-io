#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveCloudflareBuildMode } from "./cloudflare-build-route.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

function run(command, args, { shell = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env: process.env,
    shell,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

const mode = resolveCloudflareBuildMode();

if (mode === "production") {
  run("bash", ["./scripts/install-op.sh"]);
  run("bash", [
    "./scripts/with-op-environment.sh",
    "pnpm",
    "run",
    "build:with-required-secrets",
  ]);
} else {
  console.log(
    `cloudflare-build: preview branch (${process.env.WORKERS_CI_BRANCH}); using CI placeholder secrets (no 1Password).`,
  );
  run(process.execPath, [
    "./scripts/with-ci-build-secrets.mjs",
    "pnpm",
    "run",
    "build:with-required-secrets",
  ]);
}
