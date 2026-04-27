#!/usr/bin/env node

import { spawn } from "node:child_process";
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const rootWranglerConfig = path.resolve(projectRoot, "wrangler.jsonc");
const sourceEnvFile = path.resolve(
  projectRoot,
  process.env.CADENA_LOCAL_ENV_FILE ?? ".dev.vars",
);
const viteWranglerConfig = path.resolve(
  projectRoot,
  ".wrangler/vite/wrangler.jsonc",
);
const envReadLock = path.resolve(projectRoot, ".wrangler/onepassword-env.lock");
const ENV_READ_LOCK_TIMEOUT_MS = 10_000;
const ENV_READ_STALE_LOCK_MS = 30_000;

const bins = {
  vite: path.resolve(projectRoot, "node_modules/vite/bin/vite.js"),
  "react-router": path.resolve(
    projectRoot,
    "node_modules/@react-router/dev/bin.js",
  ),
  wrangler: path.resolve(projectRoot, "node_modules/wrangler/bin/wrangler.js"),
};

function relativeToRoot(filePath) {
  return path.relative(projectRoot, filePath) || ".";
}

function replaceRequired(source, search, replacement) {
  if (!source.includes(search)) {
    throw new Error(
      `Unable to generate ${relativeToRoot(viteWranglerConfig)} because ${relativeToRoot(rootWranglerConfig)} no longer contains ${search}.`,
    );
  }

  return source.replace(search, replacement);
}

function createViteWranglerConfig() {
  const rootConfig = readFileSync(rootWranglerConfig, "utf8");
  const withSchemaPath = replaceRequired(
    rootConfig,
    '"node_modules/wrangler/config-schema.json"',
    '"../../node_modules/wrangler/config-schema.json"',
  );
  const withMainPath = replaceRequired(
    withSchemaPath,
    '"./server/app.ts"',
    '"../../server/app.ts"',
  );
  const viteConfig = replaceRequired(
    withMainPath,
    '"./dist/client"',
    '"../../dist/client"',
  );

  mkdirSync(path.dirname(viteWranglerConfig), { recursive: true });
  writeFileSync(viteWranglerConfig, viteConfig);
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function removeStaleEnvReadLock() {
  if (!existsSync(envReadLock)) {
    return;
  }

  try {
    const lock = JSON.parse(readFileSync(envReadLock, "utf8"));
    const pid = Number(lock.pid);
    const createdAt = Number(lock.createdAt);
    const lockAgeMs = Date.now() - createdAt;

    if (
      !pid ||
      !createdAt ||
      lockAgeMs > ENV_READ_STALE_LOCK_MS ||
      !isProcessRunning(pid)
    ) {
      rmSync(envReadLock, { force: true });
    }
  } catch {
    rmSync(envReadLock, { force: true });
  }
}

function withEnvReadLock(callback) {
  mkdirSync(path.dirname(envReadLock), { recursive: true });
  const deadline = Date.now() + ENV_READ_LOCK_TIMEOUT_MS;

  while (Date.now() < deadline) {
    let fd;

    try {
      removeStaleEnvReadLock();
      fd = openSync(envReadLock, "wx");
      writeFileSync(
        fd,
        JSON.stringify({ createdAt: Date.now(), pid: process.pid }),
      );
      return callback();
    } catch (error) {
      if (error?.code !== "EEXIST") {
        throw error;
      }

      sleep(100);
    } finally {
      if (fd !== undefined) {
        closeSync(fd);
        rmSync(envReadLock, { force: true });
      }
    }
  }

  removeStaleEnvReadLock();

  if (!existsSync(envReadLock)) {
    return withEnvReadLock(callback);
  }

  throw new Error(`Timed out waiting for ${relativeToRoot(envReadLock)}`);
}

if (existsSync(sourceEnvFile)) {
  const parsed = withEnvReadLock(() =>
    dotenv.parse(readFileSync(sourceEnvFile, "utf8")),
  );

  for (const [key, value] of Object.entries(parsed)) {
    process.env[key] ??= value;
  }

  console.log(
    `Loaded missing local secrets from ${relativeToRoot(sourceEnvFile)} for Cloudflare Vite.`,
  );
}

createViteWranglerConfig();
process.env.CADENA_CLOUDFLARE_VITE_CONFIG = viteWranglerConfig;

const [command, ...args] = process.argv.slice(2);

if (!command || !(command in bins)) {
  console.error(
    `Usage: node scripts/cloudflare-vite.mjs ${Object.keys(bins).join("|")} [...args]`,
  );
  process.exit(1);
}

const child = spawn(process.execPath, [bins[command], ...args], {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
});

function cleanGeneratedPreviewSecrets() {
  if (command === "react-router" && args[0] === "build") {
    const generatedSecretsFile = path.resolve(
      projectRoot,
      "dist/server/.dev.vars",
    );
    rmSync(generatedSecretsFile, {
      force: true,
    });
    console.log(
      `Removed generated preview secrets file ${relativeToRoot(generatedSecretsFile)}.`,
    );
  }
}

child.on("exit", (code, signal) => {
  cleanGeneratedPreviewSecrets();

  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
