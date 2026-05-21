"use client";

import { isGoogleTranslateDomActive } from "@/lib/browser-translate";

import { getGlossary } from "./registry";
import type { GlossaryEntry } from "./types";

const ATTR_APPLIED = "data-glossary-applied";

let mutationObserver: MutationObserver | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Index of needle in hay starting at cursor; case-insensitive. */
function findIndexInsensitive(
  hay: string,
  needle: string,
  cursor: number,
): number {
  const h = hay.slice(cursor).toLowerCase();
  const n = needle.toLowerCase();
  const i = h.indexOf(n);
  return i === -1 ? -1 : cursor + i;
}

function matchLengthAt(hay: string, idx: number, source: string): number {
  const sub = hay.slice(idx);
  const re = new RegExp(`^${escapeRegex(source)}`, "i");
  const m = sub.match(re);
  return m ? m[0].length : source.length;
}

function findBestMatch(
  hay: string,
  cursor: number,
  entries: readonly GlossaryEntry[],
): { idx: number; len: number; entry: GlossaryEntry } | undefined {
  let best: { idx: number; len: number; entry: GlossaryEntry } | undefined;

  for (const entry of entries) {
    const idx = findIndexInsensitive(hay, entry.source, cursor);
    if (idx < 0) continue;
    const len = matchLengthAt(hay, idx, entry.source);
    if (
      !best ||
      idx < best.idx ||
      (idx === best.idx && len > best.len)
    ) {
      best = { idx, len, entry };
    }
  }
  return best;
}

function shouldProcessTextNode(text: Text): boolean {
  let el: HTMLElement | null = text.parentElement;
  while (el) {
    const tag = el.tagName;
    if (
      tag === "SCRIPT" ||
      tag === "STYLE" ||
      tag === "NOSCRIPT" ||
      tag === "TEXTAREA"
    ) {
      return false;
    }
    if (el.id === "google_translate_element") {
      return false;
    }
    if (el.classList.contains("glossary-term")) {
      return false;
    }
    if (el.classList.contains("notranslate")) {
      return false;
    }
    if (el.getAttribute("translate") === "no") {
      return false;
    }
    el = el.parentElement;
  }
  return true;
}

function collectTextNodes(root: HTMLElement): Text[] {
  const out: Text[] = [];
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n = w.nextNode();
  while (n) {
    const t = n as Text;
    if (t.data.trim() !== "" && shouldProcessTextNode(t)) {
      out.push(t);
    }
    n = w.nextNode();
  }
  return out;
}

function explodeText(doc: Document, text: string, entries: readonly GlossaryEntry[]): Node[] {
  const nodes: Node[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    const best = findBestMatch(text, cursor, entries);
    if (!best) {
      nodes.push(doc.createTextNode(text.slice(cursor)));
      break;
    }
    if (best.idx > cursor) {
      nodes.push(doc.createTextNode(text.slice(cursor, best.idx)));
    }
    const span = doc.createElement("span");
    span.className = "glossary-term notranslate";
    span.setAttribute("translate", "no");
    span.setAttribute("data-glossary-source", best.entry.source);
    span.textContent = best.entry.target;
    nodes.push(span);
    cursor = best.idx + best.len;
  }
  return nodes;
}

/**
 * Undo glossary wrappers; restore English `source` from `data-glossary-source`.
 */
export function removeGlossaryFromDocument(): void {
  document.documentElement.removeAttribute(ATTR_APPLIED);

  document.querySelectorAll("span.glossary-term[data-glossary-source]").forEach((el) => {
    const span = el as HTMLSpanElement;
    const src = span.getAttribute("data-glossary-source");
    const parent = span.parentNode;
    if (!parent || !src || !span.ownerDocument) return;
    parent.replaceChild(span.ownerDocument.createTextNode(src), span);
  });
}

/** Apply glossary substitutions (blocked from Google Translate) for the locale. */
export function applyGlossaryToDocument(locale: string): void {
  const entries = getGlossary(locale);
  if (entries.length === 0 || typeof document.body === "undefined") {
    return;
  }

  document.documentElement.setAttribute(ATTR_APPLIED, locale);

  let changed = true;
  while (changed) {
    changed = false;
    const snapshot = collectTextNodes(document.body);
    for (const textNode of snapshot) {
      if (!textNode.isConnected) continue;
      if (!shouldProcessTextNode(textNode)) continue;

      const full = textNode.data;
      const newParts = explodeText(document, full, entries);
      if (
        newParts.length === 1 &&
        newParts[0].nodeType === Node.TEXT_NODE &&
        newParts[0].textContent === full
      ) {
        continue;
      }

      const parent = textNode.parentNode;
      if (!parent) continue;

      const next = textNode.nextSibling;
      parent.removeChild(textNode);
      for (const part of newParts) {
        parent.insertBefore(part, next);
      }
      changed = true;
    }
  }
}

/** Stop MutationObserver scheduled by_scheduleGlossaryReapply. */
export function stopGlossaryReapply(): void {
  if (debounceTimer != null) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }
}

/**
 * Debounced re-scan untuk konten lazy atau mutasi GT setelah terjemahan.
 */
export function scheduleGlossaryReapply(locale: string): void {
  stopGlossaryReapply();

  mutationObserver = new MutationObserver(() => {
    if (!isGoogleTranslateDomActive()) return;
    if (debounceTimer != null) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      if (!isGoogleTranslateDomActive()) return;
      applyGlossaryToDocument(locale);
    }, 200);
  });

  mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}
