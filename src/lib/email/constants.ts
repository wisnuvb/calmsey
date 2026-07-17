/** Kunci site_settings untuk Gmail + alert server. */
export const GMAIL_SETTING_KEYS = {
  address: "gmail_address",
  appPassword: "gmail_app_password",
  alertEmails: "server_alert_emails",
  fromName: "from_name",
  siteName: "site_name",
} as const;

export const SECRET_SETTING_KEYS = new Set<string>([
  GMAIL_SETTING_KEYS.appPassword,
]);

/** Placeholder saat password sudah tersimpan — jangan overwrite di PUT. */
export const GMAIL_PASSWORD_MASK = "••••••••••••••••";

export const GMAIL_SMTP = {
  host: "smtp.gmail.com",
  port: 587,
} as const;

export function parseEmailRecipients(raw: string | undefined | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;]+/)
    .map((e) => e.trim())
    .filter(Boolean);
}

export function maskSecretSettings<
  T extends { key: string; value: string; type?: string },
>(settings: T[]): T[] {
  return settings.map((s) =>
    SECRET_SETTING_KEYS.has(s.key) && s.value
      ? { ...s, value: GMAIL_PASSWORD_MASK }
      : s,
  );
}
