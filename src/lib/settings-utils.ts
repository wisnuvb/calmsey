export const DEFAULT_SETTINGS = [
  { key: "site_name", value: "Turning Tides Facility", type: "TEXT" },
  {
    key: "site_tagline",
    value: "Premier rehabilitation and treatment facility",
    type: "TEXT",
  },
  {
    key: "site_description",
    value:
      "A comprehensive rehabilitation facility providing expert care and support for recovery.",
    type: "TEXT",
  },
  { key: "contact_phone", value: "+1-555-0123", type: "TEXT" },
  {
    key: "contact_email",
    value: "info@turningtidesfacility.org",
    type: "TEXT",
  },
  {
    key: "address",
    value: "123 Recovery Lane, Hope City, HC 12345",
    type: "TEXT",
  },
  {
    key: "social_facebook",
    value: "https://facebook.com/turningtidesfacility",
    type: "TEXT",
  },
  {
    key: "social_twitter",
    value: "https://twitter.com/turningtides",
    type: "TEXT",
  },
  {
    key: "social_instagram",
    value: "https://instagram.com/turningtidesfacility",
    type: "TEXT",
  },
  {
    key: "social_linkedin",
    value: "https://linkedin.com/company/turningtidesfacility",
    type: "TEXT",
  },
  { key: "maintenance_mode", value: "false", type: "BOOLEAN" },
  { key: "session_timeout", value: "60", type: "NUMBER" },
  { key: "max_login_attempts", value: "5", type: "NUMBER" },
  { key: "smtp_host", value: "", type: "TEXT" },
  { key: "smtp_port", value: "587", type: "NUMBER" },
  {
    key: "from_email",
    value: "noreply@turningtidesfacility.org",
    type: "TEXT",
  },
  { key: "from_name", value: "Turning Tides Facility", type: "TEXT" },
  { key: "max_file_size", value: "10", type: "NUMBER" },
  { key: "image_quality", value: "85", type: "NUMBER" },
  {
    key: "allowed_file_types",
    value: "jpg,jpeg,png,gif,pdf,doc,docx",
    type: "TEXT",
  },
  { key: "notify_contact_submissions", value: "true", type: "BOOLEAN" },
  { key: "notify_new_users", value: "true", type: "BOOLEAN" },
  { key: "notify_article_published", value: "false", type: "BOOLEAN" },
  {
    key: "admin_notification_email",
    value: "admin@turningtidesfacility.org",
    type: "TEXT",
  },
  { key: "google_analytics_id", value: "", type: "TEXT" },
];

export function getSetting(
  settings: Array<{ key: string; value: string }>,
  key: string,
  defaultValue = ""
): string {
  const setting = settings.find((s) => s.key === key);
  return setting?.value || defaultValue;
}

export function getSettingAsBoolean(
  settings: Array<{ key: string; value: string }>,
  key: string,
  defaultValue = false
): boolean {
  const value = getSetting(settings, key, defaultValue.toString());
  return value === "true";
}

export function getSettingAsNumber(
  settings: Array<{ key: string; value: string }>,
  key: string,
  defaultValue = 0
): number {
  const value = getSetting(settings, key, defaultValue.toString());
  return parseInt(value) || defaultValue;
}
