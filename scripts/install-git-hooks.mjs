#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
  cwd: projectRoot,
  stdio: "inherit",
});

console.log("Git hooks installed from .githooks.");
