import nodemailer from "nodemailer";

type VerificationEmailParams = {
  to: string;
  name?: string;
  token: string;
};

type PasswordResetEmailParams = {
  to: string;
  name?: string;
  token: string;
};

const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USERNAME;
  const pass = process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_ENABLE_SSL === "true";

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration is incomplete.");
  }

  return { host, port, secure, auth: { user, pass } };
};

const createTransporter = () => {
  const smtpConfig = getSmtpConfig();
  return nodemailer.createTransport({
    ...smtpConfig,
    requireTLS: !smtpConfig.secure,
    tls: {
      servername: smtpConfig.host,
    },
  });
};

export const sendVerificationEmail = async ({
  to,
  name,
  token,
}: VerificationEmailParams) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const fromEmail = process.env.EMAIL_FROM;
  const displayName = process.env.EMAIL_DISPLAY_NAME || "Great Events";

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
  }
  if (!fromEmail) {
    throw new Error("EMAIL_FROM is not configured.");
  }

  const verifyUrl = `${baseUrl.replace(/\/$/, "")}/verify-email?token=${encodeURIComponent(
    token,
  )}`;

  const transporter = createTransporter();

  const subject = "Verify your email address";
  const greetingName = name?.trim() || "there";
  const text = `Hi ${greetingName},

Please verify your email address by clicking the link below:
${verifyUrl}

This link will expire soon. If you did not create this account, you can ignore this email.`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin: 0 0 12px;">Verify your email address</h2>
      <p>Hi ${greetingName},</p>
      <p>Thanks for joining Great Events. Please confirm your email address to activate your account.</p>
      <p style="margin: 24px 0;">
        <a
          href="${verifyUrl}"
          style="background: #111827; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 999px; font-weight: 600;"
        >
          Verify email
        </a>
      </p>
      <p style="font-size: 12px; color: #6b7280;">
        This link will expire soon. If you did not create this account, you can ignore this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `${displayName} <${fromEmail}>`,
    to,
    subject,
    text,
    html,
  });
};

export const sendPasswordResetEmail = async ({
  to,
  name,
  token,
}: PasswordResetEmailParams) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const fromEmail = process.env.EMAIL_FROM;
  const displayName = process.env.EMAIL_DISPLAY_NAME || "Great Events";

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
  }
  if (!fromEmail) {
    throw new Error("EMAIL_FROM is not configured.");
  }

  const resetUrl = `${baseUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(
    token,
  )}`;

  const transporter = createTransporter();

  const subject = "Reset your password";
  const greetingName = name?.trim() || "there";
  const text = `Hi ${greetingName},

We received a request to reset your password. Use the link below to set a new password:
${resetUrl}

If you did not request a password reset, you can ignore this email. This link will expire soon.`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin: 0 0 12px;">Reset your password</h2>
      <p>Hi ${greetingName},</p>
      <p>We received a request to reset your password. Click below to set a new password.</p>
      <p style="margin: 24px 0;">
        <a
          href="${resetUrl}"
          style="background: #111827; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 999px; font-weight: 600;"
        >
          Reset password
        </a>
      </p>
      <p style="font-size: 12px; color: #6b7280;">
        If you did not request a password reset, you can ignore this email. This link will expire soon.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `${displayName} <${fromEmail}>`,
    to,
    subject,
    text,
    html,
  });
};
