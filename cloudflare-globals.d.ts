/// <reference types="@cloudflare/workers-types" />

// Optional runtime secrets. Required ones are generated from Wrangler config.
interface Env {
  CF_WEB_ANALYTICS_TOKEN?: string;
}
