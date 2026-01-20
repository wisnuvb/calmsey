import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  // Get maintenance message if available
  let maintenanceMessage = "We're currently performing maintenance. Please check back soon.";

  try {
    const maintenanceMessageSetting = await prisma.siteSetting.findUnique({
      where: { key: "maintenance_message" },
    });

    if (maintenanceMessageSetting?.value) {
      maintenanceMessage = maintenanceMessageSetting.value;
    }
  } catch (error) {
    // If error, use default message
    console.error("Error fetching maintenance message:", error);
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Maintenance Mode - Turning Tides Facility</title>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f3f4f6",
            padding: "20px",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              width: "100%",
              textAlign: "center",
              backgroundColor: "white",
              padding: "48px 32px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 24px",
                backgroundColor: "#3C62ED",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
              }}
            >
              🔧
            </div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "16px",
                margin: "0 0 16px 0",
              }}
            >
              Under Maintenance
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "#6b7280",
                lineHeight: "1.6",
                margin: "0 0 32px 0",
              }}
            >
              {maintenanceMessage}
            </p>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              <p style={{ margin: 0 }}>
                We apologize for any inconvenience. Our team is working hard to
                improve your experience.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
