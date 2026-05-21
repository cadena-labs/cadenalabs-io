#!/usr/bin/env node
/** Workers Builds entrypoint: production build with 1Password on main only. */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("bash", ["./scripts/install-op.sh"]);
run("bash", [
  "./scripts/with-op-environment.sh",
  "pnpm",
  "run",
  "build:with-required-secrets",
]);
