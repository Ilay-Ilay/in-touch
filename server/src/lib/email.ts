import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(
  email: string,

  resetUrl: string,
) {
  await resend.emails.send({
    from: "InTouch <onboarding@resend.dev>",

    to: email,

    subject: "Reset your password",

    html: `

      <h2>Reset your password</h2>

      <p>Click the link below to reset your password:</p>

      <a href="${resetUrl}">Reset password</a>

    `,
  });
}
