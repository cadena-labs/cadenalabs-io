import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { RouterContextProvider } from "react-router";

import { cloudflareContext } from "../app/lib/cloudflare-context.ts";
import { handleContactAction } from "../app/lib/contact.server.ts";

function setup(t: TestContext, fields: Record<string, string> = {}) {
  t.mock.method(console, "log", () => {});
  t.mock.method(console, "warn", () => {});
  t.mock.method(console, "error", () => {});
  const send = t.mock.fn(async () => ({ messageId: "accepted-message-id" }));
  const verify = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ success: true }),
  );
  const context = new RouterContextProvider();
  context.set(cloudflareContext, {
    env: {
      ASSETS: {} as Fetcher,
      EMAIL: { send },
      EMAIL_FROM_ADDRESS: "website@example.com",
      EMAIL_FROM_NAME: "Cadena Labs",
      CONTACT_EMAIL: "inbox@example.com",
      TURNSTILE_SITE_KEY: "test-site-key",
      TURNSTILE_SECRET_KEY: "test-secret-key",
    },
    ctx: {} as ExecutionContext,
  });
  const formData = new FormData();
  const values = {
    name: "Pat",
    email: "pat@example.com",
    message: "Please contact me.",
    "cf-turnstile-response": "test-token",
    ...fields,
  };
  for (const [name, value] of Object.entries(values)) {
    formData.set(name, value);
  }
  const args = {
    context,
    params: {},
    url: new URL("https://example.com/contact"),
    pattern: "/contact",
    request: new Request("https://example.com/contact", {
      method: "POST",
      body: formData,
      headers: { "CF-Connecting-IP": "192.0.2.1" },
    }),
  };
  return { args, send, verify };
}

test("a validated contact inquiry sends exactly once and returns the existing success", async (t) => {
  const { args, send, verify } = setup(t);

  assert.deepEqual(await handleContactAction(args), {
    ok: true,
    message: "Thank you. Your inquiry has been submitted.",
  });
  assert.equal(verify.mock.callCount(), 1);
  assert.equal(send.mock.callCount(), 1);
  const [url, options] = verify.mock.calls[0].arguments as unknown as [
    string,
    RequestInit,
  ];
  assert.equal(
    url,
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  );
  const body = options.body as FormData;
  assert.equal(body.get("secret"), "test-secret-key");
  assert.equal(body.get("response"), "test-token");
  assert.equal(body.get("remoteip"), "192.0.2.1");
});

test("honeypot submissions return generic success without verification or email", async (t) => {
  const { args, send, verify } = setup(t, { website: "spam.example.com" });

  assert.deepEqual(await handleContactAction(args), {
    ok: true,
    message: "Thank you. Your inquiry has been submitted.",
  });
  assert.equal(verify.mock.callCount(), 0);
  assert.equal(send.mock.callCount(), 0);
});

const invalidSubmissions: Record<string, string>[] = [
  { name: "" },
  { email: "" },
  { email: "invalid-address" },
  { message: "   " },
];
for (const fields of invalidSubmissions) {
  test(`invalid submissions do not verify or send: ${JSON.stringify(fields)}`, async (t) => {
    const { args, send, verify } = setup(t, fields);

    assert.deepEqual(await handleContactAction(args), {
      ok: false,
      message: "Please complete the form with a valid email address.",
    });
    assert.equal(verify.mock.callCount(), 0);
    assert.equal(send.mock.callCount(), 0);
  });
}

test("missing Turnstile tokens do not verify or send", async (t) => {
  const { args, send, verify } = setup(t, { "cf-turnstile-response": "" });

  assert.deepEqual(await handleContactAction(args), {
    ok: false,
    message: "Please complete the verification and try again.",
  });
  assert.equal(verify.mock.callCount(), 0);
  assert.equal(send.mock.callCount(), 0);
});

test("failed Turnstile verification does not send email", async (t) => {
  const { args, send, verify } = setup(t);
  verify.mock.mockImplementation(async () => Response.json({ success: false }));

  assert.deepEqual(await handleContactAction(args), {
    ok: false,
    message: "Verification failed. Please refresh the page and try again.",
  });
  assert.equal(send.mock.callCount(), 0);
});

test("Turnstile network failures do not send email", async (t) => {
  const { args, send, verify } = setup(t);
  verify.mock.mockImplementation(async () => {
    throw new Error("Network unavailable");
  });

  assert.equal((await handleContactAction(args)).ok, false);
  assert.equal(send.mock.callCount(), 0);
});

test("email rejection returns the existing failure message without retrying", async (t) => {
  const { args, send, verify } = setup(t);
  send.mock.mockImplementation(async () => {
    throw Object.assign(new Error("Sender unavailable"), {
      code: "E_SENDER_NOT_VERIFIED",
    });
  });

  assert.deepEqual(await handleContactAction(args), {
    ok: false,
    message:
      "Something went wrong while sending your inquiry. Please try again in a few minutes.",
  });
  assert.equal(verify.mock.callCount(), 1);
  assert.equal(send.mock.callCount(), 1);
});
