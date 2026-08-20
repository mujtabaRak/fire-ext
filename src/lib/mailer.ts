import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });
}

export async function sendOtpEmail(email: string, code: string) {
  const transport = getTransport();
  const from = process.env.SMTP_FROM ?? "Diners Fire Engineers Billing <billing@dinersfireengineers.example>";

  const subject = "Your Diners Fire Engineers bill generation code";
  const text = `Your one-time code is ${code}. It expires in 10 minutes. Do not share this code with anyone.`;
  const html = `<p>Your one-time code is <strong style="font-size:20px">${code}</strong>.</p><p>It expires in 10 minutes. Do not share this code with anyone.</p>`;

  if (!transport) {
    console.warn(
      `[mailer] SMTP not configured — OTP for ${email} is: ${code} (dev fallback, not emailed)`
    );
    return { delivered: false };
  }

  await transport.sendMail({ from, to: email, subject, text, html });
  return { delivered: true };
}
