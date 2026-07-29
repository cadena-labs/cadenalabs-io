import { createRequestHandler, RouterContextProvider } from "react-router";

import { cloudflareContext } from "../app/lib/cloudflare-context";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    const start = Date.now();
    const url = new URL(request.url);

    try {
      const context = new RouterContextProvider();
      context.set(cloudflareContext, { env, ctx });

      const response = await requestHandler(request, context);

      return response;
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "request_error",
          method: request.method,
          path: url.pathname,
          durationMs: Date.now() - start,
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      );

      throw error;
    }
  },
} satisfies ExportedHandler<Env>;
