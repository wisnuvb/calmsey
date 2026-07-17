import nodemailer from "nodemailer";

function parseRecipients(raw) {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;]+/)
    .map((e) => e.trim())
    .filter(Boolean);
}

/** Konfigurasi Gmail dari site_settings (prioritas) + env fallback. */
export function getAlertConfigFromMap(map, env = {}) {
  const gmailAddress = map.gmail_address?.trim();
  const gmailPassword = map.gmail_app_password?.trim();
  const recipients = parseRecipients(
    map.server_alert_emails || env.SERVER_ALERT_EMAILS,
  );
  const fromName = map.from_name?.trim() || "Turning Tides Facility";

  if (gmailAddress && gmailPassword && recipients.length > 0) {
    return {
      recipients,
      siteName:
        map.site_name?.trim() ||
        env.SERVER_ALERT_SITE_NAME?.trim() ||
        "Turning Tides Facility",
      siteUrl:
        env.SERVER_ALERT_SITE_URL?.trim() ||
        env.NEXT_PUBLIC_SITE_URL?.trim() ||
        "",
      smtp: {
        host: "smtp.gmail.com",
        port: 587,
        user: gmailAddress,
        pass: gmailPassword,
        from: `"${fromName}" <${gmailAddress}>`,
      },
    };
  }

  return getAlertConfig(env);
}

export function getAlertConfig(env) {
  const recipients = parseRecipients(env.SERVER_ALERT_EMAILS);
  const host = env.SMTP_HOST?.trim();
  const port = Number(env.SMTP_PORT || 587);
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS?.trim();
  const from =
    env.SMTP_FROM?.trim() ||
    env.SERVER_ALERT_FROM?.trim() ||
    `"Turning Tides Alerts" <${user || "noreply@localhost"}>`;

  return {
    recipients,
    siteName: env.SERVER_ALERT_SITE_NAME?.trim() || "Turning Tides Facility",
    siteUrl: env.SERVER_ALERT_SITE_URL?.trim() || env.NEXT_PUBLIC_SITE_URL?.trim() || "",
    smtp: host ? { host, port, user, pass, from } : null,
  };
}

export function isEmailConfigured(config) {
  return (
    config.recipients.length > 0 &&
    config.smtp?.host &&
    config.smtp.user &&
    config.smtp.pass
  );
}

/**
 * @param {{ smtp: NonNullable<ReturnType<typeof getAlertConfig>["smtp"]>, recipients: string[], siteName: string, siteUrl: string }} config
 * @param {{ subject: string, text: string, html: string }} message
 */
export async function sendAlertEmail(config, message) {
  if (!isEmailConfigured(config)) {
    console.warn(
      "[alert-email] Skipping email — complete Gmail setup in Admin → Settings → Email",
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  await transporter.sendMail({
    from: config.smtp.from,
    to: config.recipients.join(", "),
    subject: message.subject,
    text: message.text,
    html: message.html,
  });

  console.log(`[alert-email] Sent to: ${config.recipients.join(", ")}`);
  return true;
}

export function buildAlertMessage(config, payload) {
  const {
    status,
    healthUrl,
    pm2App,
    serverHost,
    checkedAt,
    restartAttempted,
    restartSucceeded,
    pm2Status,
    recentLog,
  } = payload;

  const statusLabels = {
    auto_restart_ok: "Auto-restart SUCCESSFUL",
    manual_required: "MANUAL ACTION REQUIRED",
    recovered: "Server back to NORMAL",
    test: "Email configuration test",
  };

  const label = statusLabels[status] || status;
  const subject = `[${config.siteName}] ${label}`;

  const actionBlock =
    status === "manual_required"
      ? `ACTION REQUIRED:
- SSH into the server and check: pm2 logs ${pm2App} --lines 50
- Try a manual restart: pm2 restart ${pm2App} --update-env
- If it still fails, check MySQL and nginx`
      : status === "auto_restart_ok"
        ? `PM2 auto-restart was triggered and the health check passed again.
No manual action is needed right now — monitor logs if needed.`
        : status === "recovered"
          ? `The server was down/unhealthy and is responding normally again.`
          : "This is a test email for the alert configuration.";

  const text = [
    `${config.siteName} — Server Health Alert`,
    "",
    `Status   : ${label}`,
    `Time     : ${checkedAt}`,
    `Server   : ${serverHost}`,
    `PM2 app  : ${pm2App}`,
    `Health   : ${healthUrl}`,
    `Restart  : ${restartAttempted ? (restartSucceeded ? "yes, succeeded" : "yes, failed") : "no"}`,
    pm2Status ? `PM2      : ${pm2Status}` : null,
    "",
    actionBlock,
    config.siteUrl ? `\nSite: ${config.siteUrl}` : null,
    recentLog ? `\n--- Recent log ---\n${recentLog}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:640px;color:#111">
      <h2 style="color:${status === "manual_required" ? "#b91c1c" : status === "recovered" ? "#15803d" : "#1d4ed8"}">
        ${label}
      </h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td style="padding:6px 0;color:#666">Time</td><td><strong>${checkedAt}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#666">Server</td><td>${serverHost}</td></tr>
        <tr><td style="padding:6px 0;color:#666">PM2 app</td><td>${pm2App}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Health URL</td><td><code>${healthUrl}</code></td></tr>
        <tr><td style="padding:6px 0;color:#666">Auto-restart</td><td>${restartAttempted ? (restartSucceeded ? "✅ Succeeded" : "❌ Failed") : "—"}</td></tr>
        ${pm2Status ? `<tr><td style="padding:6px 0;color:#666">PM2 status</td><td>${pm2Status}</td></tr>` : ""}
      </table>
      <pre style="background:#f3f4f6;padding:12px;border-radius:8px;white-space:pre-wrap;font-size:13px;margin-top:16px">${actionBlock}</pre>
      ${config.siteUrl ? `<p><a href="${config.siteUrl}">${config.siteUrl}</a></p>` : ""}
      ${recentLog ? `<pre style="background:#111827;color:#e5e7eb;padding:12px;border-radius:8px;font-size:11px;overflow:auto">${recentLog.replace(/</g, "&lt;")}</pre>` : ""}
    </div>
  `;

  return { subject, text, html };
}
