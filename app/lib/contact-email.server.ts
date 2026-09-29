export async function sendContactEmail({
  email,
  env,
  message,
  name,
}: {
  email: string;
  env: Pick<
    Env,
    "EMAIL" | "EMAIL_FROM_ADDRESS" | "EMAIL_FROM_NAME" | "CONTACT_EMAIL"
  >;
  message: string;
  name: string;
}): Promise<boolean> {
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
    const result = await env.EMAIL.send({
      from: { email: env.EMAIL_FROM_ADDRESS, name: env.EMAIL_FROM_NAME },
      to: env.CONTACT_EMAIL,
      replyTo: email,
      subject,
      html,
      text,
    });

    console.log(
      JSON.stringify({
        event: "contact_email_accepted",
        messageId: result.messageId,
      }),
    );

    return true;
  } catch (error) {
    // Provider messages may contain recipient addresses or submission content.
    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string" &&
      /^E_[A-Z0-9_]{1,100}$/.test(error.code)
        ? error.code
        : undefined;

    console.error(JSON.stringify({ event: "contact_email_error", code }));

    return false;
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
