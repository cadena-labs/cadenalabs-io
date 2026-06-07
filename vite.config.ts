import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const cloudflareConfigPath =
  process.env.CLOUDFLARE_VITE_WRANGLER_CONFIG_PATH ?? "dev.wrangler.jsonc";

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: "./server/app.ts",
        }
      : undefined,
  },
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: "0.0.0.0",
    port: 3333,
    strictPort: true,
  },
  plugins: [
    tailwindcss(),
    cloudflare({
      configPath: cloudflareConfigPath,
      viteEnvironment: { name: "ssr" },
    }),
    reactRouter(),
  ],
}));
