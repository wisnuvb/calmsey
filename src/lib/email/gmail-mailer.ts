import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import {
  GMAIL_SETTING_KEYS,
  GMAIL_SMTP,
  parseEmailRecipients,
} from "@/lib/email/constants";

const ALL_KEYS = Object.values(GMAIL_SETTING_KEYS);

export type GmailSettingsMap = Record<string, string>;

export {
  GMAIL_PASSWORD_MASK,
  GMAIL_SETTING_KEYS,
  SECRET_SETTING_KEYS,
} from "@/lib/email/constants";

export async function fetchGmailSettingsFromDb(): Promise<GmailSettingsMap> {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: [...ALL_KEYS] } },
  });
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function buildGmailFromHeader(settings: GmailSettingsMap): string {
  const name =
    settings[GMAIL_SETTING_KEYS.fromName]?.trim() || "Turning Tides Facility";
  const email = settings[GMAIL_SETTING_KEYS.address]?.trim() || "";
  return `"${name}" <${email}>`;
}

export function isGmailConfigured(settings: GmailSettingsMap): boolean {
  return !!(
    settings[GMAIL_SETTING_KEYS.address]?.trim() &&
    settings[GMAIL_SETTING_KEYS.appPassword]?.trim() &&
    parseEmailRecipients(settings[GMAIL_SETTING_KEYS.alertEmails]).length > 0
  );
}

export function createGmailTransporter(settings: GmailSettingsMap) {
  const user = settings[GMAIL_SETTING_KEYS.address]?.trim();
  const pass = settings[GMAIL_SETTING_KEYS.appPassword]?.trim();
  if (!user || !pass) {
    throw new Error("Gmail is not configured (email or App Password is missing)");
  }

  return nodemailer.createTransport({
    host: GMAIL_SMTP.host,
    port: GMAIL_SMTP.port,
    secure: false,
    auth: { user, pass },
  });
}

export async function sendGmailMessage(options: {
  settings?: GmailSettingsMap;
  to?: string[];
  subject: string;
  text: string;
  html: string;
}) {
  const settings = options.settings ?? (await fetchGmailSettingsFromDb());
  const recipients =
    options.to ??
    parseEmailRecipients(settings[GMAIL_SETTING_KEYS.alertEmails]);

  if (recipients.length === 0) {
    throw new Error("No alert email recipients configured");
  }
  if (!isGmailConfigured(settings)) {
    throw new Error(
      "Gmail setup is incomplete — add Gmail address, App Password, and alert recipient emails in Admin → Settings → Email",
    );
  }

  const transporter = createGmailTransporter(settings);
  await transporter.sendMail({
    from: buildGmailFromHeader(settings),
    to: recipients.join(", "),
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  return { recipients };
}

export function getSiteDisplayName(settings: GmailSettingsMap): string {
  return (
    settings[GMAIL_SETTING_KEYS.siteName]?.trim() || "Turning Tides Facility"
  );
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
}
