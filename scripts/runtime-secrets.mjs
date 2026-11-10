export const runtimeSecretNames = [
  "EMAIL_FROM_ADDRESS",
  "EMAIL_FROM_NAME",
  "CONTACT_EMAIL",
  "TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
];

// Uploaded when present; the site works without them.
export const optionalRuntimeSecretNames = ["CF_WEB_ANALYTICS_TOKEN"];

export function collectRuntimeSecrets(env = process.env) {
  return Object.fromEntries([
    ...runtimeSecretNames.map((name) => [name, getRequiredEnv(env, name)]),
    ...optionalRuntimeSecretNames
      .filter((name) => env[name])
      .map((name) => [name, env[name]]),
  ]);
}

function getRequiredEnv(env, name) {
  const value = env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
