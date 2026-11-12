"use client";

import { useState, useEffect, useCallback } from "react";

export interface ActiveLanguage {
  id: string;
  name: string;
  flag: string | null;
  isDefault: boolean;
}

interface UseActiveLanguagesReturn {
  languages: ActiveLanguage[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const ENDPOINT = "/api/public/languages";
const STORAGE_KEY = "tt:active-languages:v1";
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 500;

/**
 * Cache level modul: dipakai bersama semua komponen yang memanggil hook ini,
 * sehingga satu halaman hanya mengirim satu request (bukan satu per komponen).
 */
let memoryCache: ActiveLanguage[] | null = null;
let inflight: Promise<ActiveLanguage[]> | null = null;

function readStored(): ActiveLanguage[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? (parsed as ActiveLanguage[])
      : null;
  } catch {
    return null;
  }
}

function writeStored(languages: ActiveLanguage[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(languages));
  } catch {
    // localStorage bisa diblokir (private mode / kuota penuh) — abaikan.
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchOnce(): Promise<ActiveLanguage[]> {
  const response = await fetch(ENDPOINT, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch languages (HTTP ${response.status})`);
  }
  // Proxy/CDN kadang membalas HTML saat error; json() akan throw dan ikut di-retry.
  const data = await response.json();
  if (!data?.success || !Array.isArray(data.data)) {
    throw new Error(data?.error || "Failed to fetch languages");
  }
  return data.data as ActiveLanguage[];
}

async function fetchWithRetry(): Promise<ActiveLanguage[]> {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await fetchOnce();
    } catch (err) {
      lastError = err;
      if (attempt < MAX_ATTEMPTS - 1) {
        await sleep(RETRY_BASE_DELAY_MS * 2 ** attempt);
      }
    }
  }
  throw lastError;
}

function loadLanguages(force = false): Promise<ActiveLanguage[]> {
  if (!force && memoryCache) return Promise.resolve(memoryCache);
  if (inflight) return inflight;

  inflight = fetchWithRetry()
    .then((languages) => {
      memoryCache = languages;
      writeStored(languages);
      return languages;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useActiveLanguages(): UseActiveLanguagesReturn {
  const [languages, setLanguages] = useState<ActiveLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLanguages = useCallback((force = false) => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    loadLanguages(force)
      .then((result) => {
        if (!cancelled) setLanguages(result);
      })
      .catch((err) => {
        if (cancelled) return;
        // Fallback ke daftar terakhir yang berhasil dimuat agar UI tetap berfungsi.
        const stale = memoryCache ?? readStored();
        if (stale) {
          setLanguages(stale);
        } else {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => fetchLanguages(), [fetchLanguages]);

  const refetch = useCallback(() => {
    fetchLanguages(true);
  }, [fetchLanguages]);

  return { languages, loading, error, refetch };
}
