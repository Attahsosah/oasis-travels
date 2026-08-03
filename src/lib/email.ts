import "server-only";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

/** Where internal notifications (new booking / message) are sent. */
export function notifyAddress(): string | undefined {
  return process.env.BOOKINGS_NOTIFY_EMAIL ?? EMAIL_FROM;
}

interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends an email via Resend's REST API (no SDK dependency). Fully optional:
 * returns false without throwing when `RESEND_API_KEY` / `EMAIL_FROM` are unset,
 * so form and booking flows never break just because email isn't configured.
 */
export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  if (!RESEND_API_KEY || !EMAIL_FROM) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: input.to,
        subject: input.subject,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
