import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Parse file .env sederhana (tanpa dependency dotenv). */
export function parseEnvFile(content) {
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

/** Muat .env lalu .env.production dari root project; process.env menang. */
export function loadProjectEnv(rootDir) {
  const merged = {};
  for (const name of [".env", ".env.production"]) {
    const filePath = path.join(rootDir, name);
    if (!fs.existsSync(filePath)) continue;
    Object.assign(merged, parseEnvFile(fs.readFileSync(filePath, "utf8")));
  }
  return { ...merged, ...process.env };
}

export function projectRoot() {
  return path.join(__dirname, "..", "..");
}
