import assert from "node:assert/strict";
import test from "node:test";

import { sendContactEmail } from "../app/lib/contact-email.server.ts";

const inquiry = {
  name: "Pat O'Neil & <Team>",
  email: "pat@example.com",
  message: 'First <script>alert("hello")</script> & inquiry\nSecond line',
};

function createEnv(send: SendEmail["send"]) {
  return {
    EMAIL: { send },
    EMAIL_FROM_ADDRESS: "website@example.com",
    EMAIL_FROM_NAME: "Cadena Labs",
    CONTACT_EMAIL: "inbox@example.com",
  };
}

test("sends the existing inquiry content through the native email binding", async (t) => {
  const log = t.mock.method(console, "log", () => {});
  const send = t.mock.fn(
    async (_message: EmailMessage | EmailMessageBuilder) => ({
      messageId: "accepted-message-id",
    }),
  );
  const env = createEnv(send);

  assert.equal(await sendContactEmail({ env, ...inquiry }), true);
  assert.equal(send.mock.callCount(), 1);
  const payload = send.mock.calls[0].arguments[0];
  assert.ok("subject" in payload);
  assert.deepEqual(payload.from, {
    email: "website@example.com",
    name: "Cadena Labs",
  });
  assert.equal(payload.to, "inbox@example.com");
  assert.equal(payload.replyTo, inquiry.email);
  assert.equal(payload.subject, "cadenalabs.io Inquiry Form Submission");
  assert.equal(
    payload.text,
    [
      "New Cadena Labs inquiry",
      "",
      "Name: Pat O'Neil & <Team>",
      "Email: pat@example.com",
      "",
      inquiry.message,
    ].join("\n"),
  );
  assert.ok(payload.html?.includes("Pat O&#039;Neil &amp; &lt;Team&gt;"));
  assert.ok(
    payload.html?.includes(
      "First &lt;script&gt;alert(&quot;hello&quot;)&lt;/script&gt; &amp; inquiry<br>Second line",
    ),
  );
  assert.ok(payload.html?.includes("pat@example.com"));
  assert.ok(!payload.html?.includes("<script>"));
  assert.deepEqual(JSON.parse(log.mock.calls[0].arguments[0]), {
    event: "contact_email_accepted",
    messageId: "accepted-message-id",
  });
});

test("waits for acceptance before returning success", async (t) => {
  t.mock.method(console, "log", () => {});
  let accept!: (result: EmailSendResult) => void;
  const pending = new Promise<EmailSendResult>((resolve) => {
    accept = resolve;
  });
  const env = createEnv(() => pending);
  let finished = false;
  const sending = sendContactEmail({ env, ...inquiry }).then((result) => {
    finished = true;
    return result;
  });

  await Promise.resolve();
  assert.equal(finished, false);
  accept({ messageId: "accepted-message-id" });
  assert.equal(await sending, true);
});

for (const code of [
  "E_SENDER_NOT_VERIFIED",
  "E_RECIPIENT_SUPPRESSED",
  "E_RATE_LIMIT_EXCEEDED",
  "E_DELIVERY_FAILED",
]) {
  test(`returns failure without retrying or logging sensitive provider messages: ${code}`, async (t) => {
    const log = t.mock.method(console, "log", () => {});
    const errorLog = t.mock.method(console, "error", () => {});
    const send = t.mock.fn(async () => {
      throw Object.assign(new Error(`private content: ${inquiry.message}`), {
        code,
      });
    });

    assert.equal(
      await sendContactEmail({ env: createEnv(send), ...inquiry }),
      false,
    );
    assert.equal(send.mock.callCount(), 1);
    assert.equal(log.mock.callCount(), 0);
    assert.deepEqual(JSON.parse(errorLog.mock.calls[0].arguments[0]), {
      event: "contact_email_error",
      code,
    });
  });
}

for (const error of [
  new Error("private details"),
  "private details",
  null,
  { code: "private details", message: "private details" },
]) {
  test("handles unknown provider failures without leaking their contents", async (t) => {
    const errorLog = t.mock.method(console, "error", () => {});
    const env = createEnv(async () => {
      throw error;
    });

    assert.equal(await sendContactEmail({ env, ...inquiry }), false);
    assert.deepEqual(JSON.parse(errorLog.mock.calls[0].arguments[0]), {
      event: "contact_email_error",
    });
  });
}
