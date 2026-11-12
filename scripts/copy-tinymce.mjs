import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fse from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const topDir = path.join(__dirname, "..");

console.log("📦 Copying TinyMCE to public folder...");

try {
  fse.emptyDirSync(path.join(topDir, "public", "tinymce"));
  // pnpm menjadikan node_modules/tinymce sebagai symlink ke store, jadi resolve dulu.
  fse.copySync(
    fs.realpathSync(path.join(topDir, "node_modules", "tinymce")),
    path.join(topDir, "public", "tinymce"),
    { overwrite: true, dereference: true }
  );
  console.log("✅ TinyMCE copied successfully!");
} catch (error) {
  console.error("❌ Error copying TinyMCE:", error);
  process.exit(1);
}
