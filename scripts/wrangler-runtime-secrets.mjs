#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { collectRuntimeSecrets } from "./runtime-secrets.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const wranglerBin = path.resolve(
  projectRoot,
  "node_modules/wrangler/bin/wrangler.js",
);
const builtWranglerConfig = path.resolve(
  projectRoot,
  "dist/server/wrangler.json",
);
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(
    "Usage: node scripts/wrangler-runtime-secrets.mjs <deploy|versions upload> [...wrangler args]",
  );
  process.exit(1);
}

if (!existsSync(builtWranglerConfig)) {
  console.error("Missing dist/server/wrangler.json. Run pnpm run build first.");
  process.exit(1);
}

const tempDir = mkdtempSync(path.join(tmpdir(), "cadena-runtime-secrets-"));
const secretsFile = path.join(tempDir, "secrets.json");

try {
  writeFileSync(secretsFile, JSON.stringify(collectRuntimeSecrets()));
  chmodSync(secretsFile, 0o600);

  const result = spawnSync(
    process.execPath,
    [
      wranglerBin,
      ...args,
      "--config",
      builtWranglerConfig,
      "--secrets-file",
      secretsFile,
    ],
    {
      cwd: projectRoot,
      encoding: "utf8",
      env: process.env,
      stdio: "inherit",
    },
  );

  if (result.error) {
    throw result.error;
  }

  process.exit(result.status ?? 1);
} finally {
  rmSync(tempDir, { force: true, recursive: true });
}
