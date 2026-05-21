/**
 * Build TypeScript glossary data from CSV in data/glossary/.
 * UTF-8. Run: node scripts/build-glossary.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data", "glossary");
const OUT_DIR = path.join(ROOT, "src", "lib", "glossary", "data");

/** Parse minimal CSV with quoted fields; supports \r\n */
function parseCsvRows(content) {
  const rows = [];
  /** @type {string[]} */
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const len = content.length;

  const flushField = () => {
    row.push(field);
    field = "";
  };

  while (i < len) {
    const c = content[i];

    if (inQuotes) {
      if (c === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (c === ",") {
      flushField();
      i += 1;
      continue;
    }

    if (c === "\n" || c === "\r") {
      flushField();
      if (
        row.length >= 2 &&
        row.some((f) => f.trim() !== "") &&
        row[0]?.trim()
      ) {
        rows.push(row.slice(0, 2));
      }
      row = [];
      if (c === "\r" && content[i + 1] === "\n") i += 2;
      else i += 1;
      continue;
    }

    field += c;
    i += 1;
  }

  if (field !== "" || row.length > 0) {
    flushField();
    if (
      row.length >= 2 &&
      row.some((f) => f.trim() !== "") &&
      row[0]?.trim()
    ) {
      rows.push(row.slice(0, 2));
    }
  }

  return rows;
}

/**
 * Expand `a / b` source variants (same target).
 * @returns {{ source: string, target: string }[]}
 */
function expandVariants(source, target) {
  const trimmed = source.trim();
  if (trimmed.includes(" / ")) {
    return trimmed.split(" / ").map((s) => ({
      source: s.trim(),
      target,
    }));
  }
  return [{ source: trimmed, target }];
}

function stringifyEntry(e) {
  return `  {\n    source: ${JSON.stringify(e.source)},\n    target: ${JSON.stringify(
    e.target
  )},\n  }`;
}

function main() {
  const files = [
    { file: "en-es.csv", exportBase: "es" },
    { file: "en-fr.csv", exportBase: "fr" },
    { file: "en-id.csv", exportBase: "id" },
    { file: "en-pt.csv", exportBase: "pt" },
  ];

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const { file, exportBase } of files) {
    const filepath = path.join(DATA_DIR, file);
    const raw = fs.readFileSync(filepath, "utf8");
    const parsed = parseCsvRows(raw);
    /** @type {Map<string, { source: string; target: string }>} */
    const map = new Map();

    let headerSeen = false;
    for (const cols of parsed) {
      const [srcCol, tgtCol] = cols;
      const source = srcCol.trim();
      const tgt = tgtCol.trim();
      if (!source || !tgt) continue;
      const isHdr =
        !headerSeen &&
        source.toLowerCase() === "source" &&
        tgt.toLowerCase() === "target";
      if (!headerSeen && isHdr) {
        headerSeen = true;
        continue;
      }
      headerSeen = true;

      for (const { source: s, target: t } of expandVariants(source, tgt)) {
        const key = s.toLowerCase();
        if (!map.has(key)) map.set(key, { source: s, target: t });
      }
    }

    /** @type {{ source: string; target: string }[]} */
    const entries = [...map.values()].sort(
      (a, b) => b.source.length - a.source.length
    );

    const outPath = path.join(OUT_DIR, `${exportBase}.ts`);
    const body = [
      `/** Auto-generated — do not edit. Run npm run build:glossary */`,
      ``,
      `import type { GlossaryEntry } from "../types";`,
      ``,
      `export const GLOSSARY_${exportBase.toUpperCase()}: readonly GlossaryEntry[] = [`,
      entries.map(stringifyEntry).join(",\n"),
      `] as const;`,
      ``,
    ].join("\n");

    fs.writeFileSync(outPath, body, "utf8");
    console.warn(`wrote ${outPath} (${entries.length} entries)`);
  }

  console.warn("done");
}

main();
