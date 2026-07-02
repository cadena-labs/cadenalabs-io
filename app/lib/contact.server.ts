import type { ActionFunctionArgs } from "react-router";

import { isValidEmail } from "~/lib/email";

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

  const turnstileValid = await verifyTurnstile({
    env: context.cloudflare.env,
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
    env: context.cloudflare.env,
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

async function sendContactEmail({
  email,
  env,
  message,
  name,
}: {
  email: string;
  env: Env;
  message: string;
  name: string;
}) {
  const subject = "cadenalabs.io Inquiry Form Submission";
  const text = [
    "New Cadena Labs inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    message,
  ].join("\n");
  const html = `
    <h1>New Cadena Labs inquiry</h1>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      body: JSON.stringify({
        from: `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`,
        html,
        reply_to: email,
        subject,
        text,
        to: [env.CONTACT_EMAIL],
      }),
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      method: "POST",
    });

    if (!response.ok) {
      const errorMessage = await readProviderError(response);
      console.error(
        JSON.stringify({
          event: "resend_error",
          message: errorMessage,
          status: response.status,
        }),
      );
    }

    return response.ok;
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "resend_error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );

    return false;
  }
}

async function readProviderError(response: Response) {
  try {
    const payload = (await response.json()) as { message?: unknown };

    if (typeof payload.message === "string") {
      return payload.message;
    }

    return "Unknown Resend error";
  } catch {
    return "Unable to parse Resend error";
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
