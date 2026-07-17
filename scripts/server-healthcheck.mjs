#!/usr/bin/env node
/**
 * Health check + auto-restart PM2 + email alert via Gmail (site_settings DB).
 *
 * Email config: Admin → Settings → Email
 *   gmail_address, gmail_app_password, server_alert_emails
 *
 * Cron (every 2 minutes):
 *   */2 * * * * .../scripts/healthcheck.sh >> .../logs/healthcheck.log 2>&1
 *
 * Test email:
 *   node scripts/server-healthcheck.mjs --test-email
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { loadProjectEnv, projectRoot } from "./lib/load-env.mjs";
import {
  buildAlertMessage,
  disconnectEmailDb,
  isEmailConfigured,
  loadAlertConfigFromDb,
  sendAlertEmail,
} from "./lib/email-from-db.mjs";

const ROOT = projectRoot();
const STATE_FILE = path.join(ROOT, "logs", "healthcheck-state.json");
const LOG_DIR = path.join(ROOT, "logs");

const env = loadProjectEnv(ROOT);
const PM2_APP = env.PM2_APP || "turningtidesfacility";
const PORT = env.HEALTHCHECK_PORT || env.PORT || "2039";
const HEALTH_URL =
  env.HEALTHCHECK_URL ||
  `http://127.0.0.1:${PORT}/api/public/languages`;
const MAX_TIME_SEC = Number(env.HEALTHCHECK_TIMEOUT_SEC || 10);
const COOLDOWN_MS =
  Number(env.SERVER_ALERT_COOLDOWN_MINUTES || 15) * 60 * 1000;
const RESTART_WAIT_MS = Number(env.HEALTHCHECK_RESTART_WAIT_MS || 8000);

let alertConfigPromise = null;

function getAlertConfig() {
  if (!alertConfigPromise) {
    alertConfigPromise = loadAlertConfigFromDb();
  }
  return alertConfigPromise;
}

function log(msg) {
  console.log(`${new Date().toISOString()} [healthcheck] ${msg}`);
}

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

function readState() {
  ensureLogDir();
  if (!fs.existsSync(STATE_FILE)) {
    return { health: "healthy", lastAlertAt: null, lastDownAt: null };
  }
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { health: "healthy", lastAlertAt: null, lastDownAt: null };
  }
}

function writeState(state) {
  ensureLogDir();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function shouldSendAlert(state) {
  if (!state.lastAlertAt) return true;
  return Date.now() - new Date(state.lastAlertAt).getTime() >= COOLDOWN_MS;
}

function serverHostLabel() {
  try {
    return execSync("hostname -f 2>/dev/null || hostname", {
      encoding: "utf8",
    }).trim();
  } catch {
    return "unknown-host";
  }
}

function pm2StatusLine() {
  try {
    return execSync(`pm2 jlist`, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
  } catch {
    return "";
  }
}

function getPm2AppSummary() {
  try {
    const raw = pm2StatusLine();
    if (!raw) return null;
    const list = JSON.parse(raw);
    const app = list.find((p) => p.name === PM2_APP);
    if (!app) return `App "${PM2_APP}" not found in PM2`;
    const proc = app.pm2_env;
    return `status=${proc.status}, restarts=${proc.restart_time}, uptime=${proc.pm_uptime ? Math.round((Date.now() - proc.pm_uptime) / 1000) + "s" : "?"}`;
  } catch {
    return null;
  }
}

function getRecentPm2Logs() {
  try {
    return execSync(`pm2 logs ${PM2_APP} --nostream --lines 15 2>&1`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).slice(-2500);
  } catch {
    return "";
  }
}

async function checkHealth() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MAX_TIME_SEC * 1000);
  try {
    const res = await fetch(HEALTH_URL, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      redirect: "manual",
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function restartPm2() {
  try {
    execSync(
      `pm2 restart ${PM2_APP} --update-env || pm2 start ecosystem.config.js --only ${PM2_APP}`,
      { cwd: ROOT, stdio: "pipe", encoding: "utf8" },
    );
    return true;
  } catch (err) {
    log(`PM2 restart failed: ${err.message}`);
    return false;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function notify(status, extra = {}) {
  const alertConfig = await getAlertConfig();
  if (!isEmailConfigured(alertConfig)) {
    log("Email alert not configured — skipping notification");
    return false;
  }

  const message = buildAlertMessage(alertConfig, {
    status,
    healthUrl: HEALTH_URL,
    pm2App: PM2_APP,
    serverHost: serverHostLabel(),
    checkedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
    recentLog: extra.includeLogs ? getRecentPm2Logs() : undefined,
    ...extra,
  });

  return sendAlertEmail(alertConfig, message);
}

async function runTestEmail() {
  log("Test email mode...");
  const alertConfig = await getAlertConfig();
  if (!isEmailConfigured(alertConfig)) {
    console.error(
      "ERROR: Complete Gmail setup in Admin → Settings → Email (address, app password, alert recipients)",
    );
    process.exit(1);
  }
  await notify("test", {
    restartAttempted: false,
    restartSucceeded: false,
    pm2Status: getPm2AppSummary(),
  });
  log("Test email finished");
}

async function main() {
  if (process.argv.includes("--test-email")) {
    await runTestEmail();
    return;
  }

  const state = readState();
  const healthy = await checkHealth();

  if (healthy) {
    if (state.health === "down" || state.health === "degraded") {
      log("Server healthy again — sending recovery notification");
      await notify("recovered", {
        restartAttempted: false,
        restartSucceeded: false,
        pm2Status: getPm2AppSummary(),
      });
      writeState({ health: "healthy", lastAlertAt: new Date().toISOString(), lastDownAt: null });
    }
    return;
  }

  log(`FAIL ${HEALTH_URL}`);

  const restartAttempted = restartPm2();
  let restartSucceeded = false;

  if (restartAttempted) {
    log(`Waiting ${RESTART_WAIT_MS}ms after restart...`);
    await sleep(RESTART_WAIT_MS);
    restartSucceeded = await checkHealth();
  }

  const pm2Status = getPm2AppSummary();
  const now = new Date().toISOString();

  if (restartSucceeded) {
    log("Auto-restart succeeded — server OK");
    await notify("auto_restart_ok", {
      restartAttempted: true,
      restartSucceeded: true,
      pm2Status,
      includeLogs: true,
    });
    writeState({ health: "degraded", lastAlertAt: now, lastDownAt: state.lastDownAt || now });
    return;
  }

  log("Auto-restart failed or server still down — manual action required");
  if (shouldSendAlert(state)) {
    await notify("manual_required", {
      restartAttempted,
      restartSucceeded: false,
      pm2Status,
      includeLogs: true,
    });
    writeState({ health: "down", lastAlertAt: now, lastDownAt: state.lastDownAt || now });
  } else {
    log(`Cooldown active — email skipped (interval ${env.SERVER_ALERT_COOLDOWN_MINUTES || 15} minutes)`);
    writeState({ ...state, health: "down", lastDownAt: state.lastDownAt || now });
  }
}

main()
  .catch((err) => {
    console.error("[healthcheck] Fatal:", err);
    process.exit(1);
  })
  .finally(() => disconnectEmailDb());
