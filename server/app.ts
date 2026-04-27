import { createRequestHandler } from "react-router";

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    const start = Date.now();
    const url = new URL(request.url);

    try {
      const response = await requestHandler(request, {
        cloudflare: { env, ctx },
      });

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
