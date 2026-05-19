#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  ciRuntimeSecretEnv,
  opCredentialNames,
} from "./ci-runtime-secrets.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const userArgs = process.argv.slice(2);

if (userArgs.length === 0) {
  console.error(
    "Usage: node ./scripts/with-ci-build-secrets.mjs <command> [args...]",
  );
  process.exit(1);
}

const env = { ...process.env, ...ciRuntimeSecretEnv };

for (const name of opCredentialNames) {
  if (env[name]) {
    console.warn(
      `with-ci-build-secrets: unsetting ${name} (preview builds must not use 1Password).`,
    );
    delete env[name];
  }
}
const [command, ...args] = userArgs;
const result = spawnSync(command, args, {
  cwd: projectRoot,
  env,
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
