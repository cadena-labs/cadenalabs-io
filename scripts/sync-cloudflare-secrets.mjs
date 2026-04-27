#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  collectRuntimeSecrets,
  runtimeSecretNames,
} from "./runtime-secrets.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const wranglerBin = path.resolve(
  projectRoot,
  "node_modules/wrangler/bin/wrangler.js",
);
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const wranglerArgs = args.filter((arg) => arg !== "--dry-run");
const secrets = collectRuntimeSecrets();

if (dryRun) {
  console.log(
    `Validated Cloudflare secret sync inputs: ${runtimeSecretNames.join(", ")}`,
  );
  process.exit(0);
}

console.log(
  `Syncing Cloudflare Worker secrets from 1Password Environment: ${runtimeSecretNames.join(", ")}`,
);

const result = spawnSync(
  process.execPath,
  [
    wranglerBin,
    "secret",
    "bulk",
    "--config",
    "wrangler.jsonc",
    ...wranglerArgs,
  ],
  {
    cwd: projectRoot,
    encoding: "utf8",
    env: process.env,
    input: JSON.stringify(secrets),
    stdio: ["pipe", "inherit", "inherit"],
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
