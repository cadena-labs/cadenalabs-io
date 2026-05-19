import test from "node:test";
import assert from "node:assert/strict";

import { resolveCloudflareBuildMode } from "../scripts/cloudflare-build-route.mjs";

test("resolveCloudflareBuildMode uses production for local builds", () => {
  assert.equal(resolveCloudflareBuildMode({}), "production");
  assert.equal(
    resolveCloudflareBuildMode({ WORKERS_CI: "0", WORKERS_CI_BRANCH: "dev" }),
    "production",
  );
});

test("resolveCloudflareBuildMode uses production on main in Workers CI", () => {
  assert.equal(
    resolveCloudflareBuildMode({
      WORKERS_CI: "1",
      WORKERS_CI_BRANCH: "main",
    }),
    "production",
  );
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
