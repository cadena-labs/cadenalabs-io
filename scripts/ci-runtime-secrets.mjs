/** Placeholder runtime secrets for CI and untrusted Workers preview builds. */
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
