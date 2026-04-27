export const runtimeSecretNames = [
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "RESEND_FROM_NAME",
  "CONTACT_EMAIL",
  "TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
];

export function collectRuntimeSecrets(env = process.env) {
  return Object.fromEntries(
    runtimeSecretNames.map((name) => [name, getRequiredEnv(env, name)]),
  );
}

function getRequiredEnv(env, name) {
  const value = env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
