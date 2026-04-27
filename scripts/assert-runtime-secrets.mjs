#!/usr/bin/env node

import { runtimeSecretNames } from "./runtime-secrets.mjs";

const missing = runtimeSecretNames.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(
    `Missing required 1Password runtime secrets: ${missing.join(", ")}`,
  );
  process.exit(1);
}

console.log("Required 1Password runtime secrets are present.");
