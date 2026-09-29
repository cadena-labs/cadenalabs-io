import type { ActionFunctionArgs } from "react-router";

import { cloudflareContext } from "./cloudflare-context.ts";
import { sendContactEmail } from "./contact-email.server.ts";
import { isValidEmail } from "./email.ts";

export type ContactActionData =
  { ok: true; message: string } | { ok: false; message: string };

type TurnstileOutcome = {
  success: boolean;
  "error-codes"?: string[];
};

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 4000;

export async function handleContactAction({
  context,
  request,
}: ActionFunctionArgs): Promise<ContactActionData> {
  const formData = await request.formData();
  const name = getTrimmedField(formData, "name", MAX_NAME_LENGTH);
  const email = getTrimmedField(formData, "email", MAX_EMAIL_LENGTH);
  const message = getTrimmedField(formData, "message", MAX_MESSAGE_LENGTH);
  const honeypot = getTrimmedField(formData, "website", 200);
  const turnstileToken = getTrimmedField(
    formData,
    "cf-turnstile-response",
    4096,
  );

  if (honeypot) {
    return genericSuccess();
  }

  if (!name || !email || !message || !isValidEmail(email)) {
    return {
      ok: false,
      message: "Please complete the form with a valid email address.",
    };
  }

  if (!turnstileToken) {
    return {
      ok: false,
      message: "Please complete the verification and try again.",
    };
  }

  const { env } = context.get(cloudflareContext);

  const turnstileValid = await verifyTurnstile({
    env,
    remoteIp:
      request.headers.get("CF-Connecting-IP") ??
      request.headers.get("X-Forwarded-For") ??
      undefined,
    token: turnstileToken,
  });

  if (!turnstileValid) {
    return {
      ok: false,
      message: "Verification failed. Please refresh the page and try again.",
    };
  }

  const sent = await sendContactEmail({
    env,
    email,
    message,
    name,
  });

  if (!sent) {
    return {
      ok: false,
      message:
        "Something went wrong while sending your inquiry. Please try again in a few minutes.",
    };
  }

  return genericSuccess();
}

function getTrimmedField(formData: FormData, name: string, maxLength: number) {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function genericSuccess(): ContactActionData {
  return {
    ok: true,
    message: "Thank you. Your inquiry has been submitted.",
  };
}

async function verifyTurnstile({
  env,
  remoteIp,
  token,
}: {
  env: Env;
  remoteIp?: string;
  token: string;
}) {
  const verification = new FormData();
  verification.append("secret", env.TURNSTILE_SECRET_KEY);
  verification.append("response", token);

  if (remoteIp) {
    verification.append("remoteip", remoteIp);
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        body: verification,
        method: "POST",
      },
    );
    const outcome = (await response.json()) as TurnstileOutcome;

    if (!outcome.success) {
      console.warn(
        JSON.stringify({
          event: "turnstile_failed",
          errorCodes: outcome["error-codes"] ?? [],
        }),
      );
    }

    return outcome.success;
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "turnstile_error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );

    return false;
  }
}
