/**
 * Placeholder values for build-time secret assertions in CI and untrusted
 * Workers preview branches. `cloudflare:preview` does not upload these to the
 * Worker; production runtime bindings are unchanged. Do not expect the contact
 * form to work on preview URLs.
 */
export const ciRuntimeSecretEnv = {
  CONTACT_EMAIL: "ci@example.com",
  RESEND_API_KEY: "ci",
  RESEND_FROM_EMAIL: "ci-from@example.com",
  RESEND_FROM_NAME: "CI Sender",
  TURNSTILE_SECRET_KEY: "ci",
  TURNSTILE_SITE_KEY: "ci",
};

/** Must not be present when running untrusted preview builds. */
export const opCredentialNames = [
  "OP_SERVICE_ACCOUNT_TOKEN",
  "OP_ENVIRONMENT_ID",
];
