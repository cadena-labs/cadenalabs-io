import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

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
    port: 3333,
    strictPort: true,
    watch: {
      ignored: ["**/.dev.vars", "**/.dev.vars.*", "**/.env", "**/.env.*"],
    },
  },
  plugins: [
    tailwindcss(),
    cloudflare({
      configPath: process.env.CADENA_CLOUDFLARE_VITE_CONFIG,
      viteEnvironment: { name: "ssr" },
    }),
    reactRouter(),
  ],
}));
