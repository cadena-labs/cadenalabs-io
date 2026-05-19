/**
 * Chooses production (1Password) vs preview (CI placeholders) Workers Builds.
 * Local builds default to production so `pnpm run cloudflare:build` matches deploy.
 */
export type CloudflareBuildMode = "production" | "preview";

export function resolveCloudflareBuildMode(
  env: Record<string, string | undefined> = process.env,
  {
    productionBranch = env.CLOUDFLARE_PRODUCTION_BRANCH ?? "main",
  }: { productionBranch?: string } = {},
): CloudflareBuildMode {
  if (env.WORKERS_CI !== "1") {
    return "production";
  }

  const branch = env.WORKERS_CI_BRANCH ?? "";
  if (branch === productionBranch) {
    return "production";
  }

  return "preview";
}
