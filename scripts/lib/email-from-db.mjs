import { PrismaClient } from "@prisma/client";
import { loadProjectEnv, projectRoot } from "./load-env.mjs";
import {
  buildAlertMessage,
  getAlertConfigFromMap,
  isEmailConfigured,
  sendAlertEmail,
} from "./send-alert-email.mjs";

const GMAIL_KEYS = [
  "gmail_address",
  "gmail_app_password",
  "server_alert_emails",
  "from_name",
  "site_name",
];

let prisma;

function getPrisma() {
  if (!prisma) {
    const env = loadProjectEnv(projectRoot());
    prisma = new PrismaClient({
      datasources: env.DATABASE_URL ? { db: { url: env.DATABASE_URL } } : undefined,
    });
  }
  return prisma;
}

/** Muat konfigurasi Gmail + alert dari tabel site_settings. */
export async function loadAlertConfigFromDb() {
  const rows = await getPrisma().siteSetting.findMany({
    where: { key: { in: GMAIL_KEYS } },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const env = loadProjectEnv(projectRoot());
  return getAlertConfigFromMap(map, env);
}

export async function disconnectEmailDb() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}

export { buildAlertMessage, isEmailConfigured, sendAlertEmail };
