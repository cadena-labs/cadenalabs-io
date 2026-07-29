import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const cloudflareConfigPath =
  process.env.CLOUDFLARE_VITE_WRANGLER_CONFIG_PATH ?? "dev.wrangler.jsonc";

export default defineConfig({
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          input: "./server/app.ts",
        },
      },
    },
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
});
