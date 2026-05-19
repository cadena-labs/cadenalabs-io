import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { resolveCloudflareBuildMode } from "../scripts/cloudflare-build-route.ts";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

test("resolveCloudflareBuildMode uses production for local builds", () => {
  assert.equal(resolveCloudflareBuildMode({}), "production");
  assert.equal(
    resolveCloudflareBuildMode({ WORKERS_CI: "0", WORKERS_CI_BRANCH: "dev" }),
    "production",
  );
});

test("resolveCloudflareBuildMode uses production on main in Workers CI by default", () => {
  assert.equal(
    resolveCloudflareBuildMode({
      WORKERS_CI: "1",
      WORKERS_CI_BRANCH: "main",
    }),
    "production",
  );
});

test("resolveCloudflareBuildMode respects CLOUDFLARE_PRODUCTION_BRANCH override", () => {
  assert.equal(
    resolveCloudflareBuildMode({
      WORKERS_CI: "1",
      WORKERS_CI_BRANCH: "main",
      CLOUDFLARE_PRODUCTION_BRANCH: "release",
    }),
    "preview",
  );
});

test("resolveCloudflareBuildMode uses preview on other branches in Workers CI", () => {
  assert.equal(
    resolveCloudflareBuildMode({
      WORKERS_CI: "1",
      WORKERS_CI_BRANCH: "feature/safe-preview",
    }),
    "preview",
  );
});

test("with-ci-build-secrets strips 1Password credentials from the child env", () => {
  const opCredentialNames = [
    "OP_SERVICE_ACCOUNT_TOKEN",
    "OP_ENVIRONMENT_ID",
  ] as const;

  for (const opEnv of [
    {
      OP_SERVICE_ACCOUNT_TOKEN: "must-not-reach-child",
      OP_ENVIRONMENT_ID: "must-not-reach-child",
    },
    { OP_SERVICE_ACCOUNT_TOKEN: "", OP_ENVIRONMENT_ID: "" },
  ]) {
    const result = spawnSync(
      process.execPath,
      [
        "./scripts/with-ci-build-secrets.mjs",
        process.execPath,
        "-e",
        `const names = ${JSON.stringify(opCredentialNames)}; console.log(JSON.stringify(Object.fromEntries(names.map((n) => [n, process.env[n] ?? null]))));`,
      ],
      {
        cwd: projectRoot,
        env: { ...process.env, ...opEnv },
        encoding: "utf8",
      },
    );

    assert.equal(result.status, 0, result.stderr);
    const passed = JSON.parse(result.stdout.trim());
    for (const name of opCredentialNames) {
      assert.equal(passed[name], null);
    }
  }
});
