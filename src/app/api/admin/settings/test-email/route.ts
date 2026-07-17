import { requireAuth, ROLE_ADMIN } from "@/lib/auth-helpers";
import { parseEmailRecipients } from "@/lib/email/constants";
import {
  fetchGmailSettingsFromDb,
  getSiteDisplayName,
  isGmailConfigured,
  sendGmailMessage,
} from "@/lib/email/gmail-mailer";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const authResult = await requireAuth(ROLE_ADMIN);
    if (!authResult.success) return authResult.response;

    const settings = await fetchGmailSettingsFromDb();

    if (!isGmailConfigured(settings)) {
      return NextResponse.json(
        {
          error:
            "Complete Gmail address, App Password, and alert recipient emails, then save.",
        },
        { status: 400 },
      );
    }

    const recipients = parseEmailRecipients(settings.server_alert_emails);
    const siteName = getSiteDisplayName(settings);

    await sendGmailMessage({
      settings,
      subject: `[${siteName}] Test email — Gmail configuration OK`,
      text: `Test email from the ${siteName} admin panel.\n\nIf you received this message, Gmail is configured correctly for server alerts.`,
      html: `<p>Test email from <strong>${siteName}</strong>.</p><p>If you received this message, Gmail is configured correctly for server alerts.</p>`,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent to: ${recipients.join(", ")}`,
    });
  } catch (error) {
    console.error("Test email error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to send test email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
