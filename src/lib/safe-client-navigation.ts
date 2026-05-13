"use client";

import {
  awaitGoogleTranslateDomRestoredForClientNavigation,
  isGoogleTranslateDomActive,
} from "@/lib/browser-translate";

export type NextLikeRouter = {
  push: (href: string) => void;
};

/**
 * Navigasi klien Next (`router.push`) setelah DOM dikembalikan dari layer Google Translate,
 * supaya React tidak memicu `removeChild` / NotFoundError pada pohon yang sudah dimutasi GT.
 * Jika teardown tidak berhasil (masih `translated-*` di `body`), fallback ke navigasi dokumen penuh.
 */
export async function clientNavigateWithGoogleTranslateSafety(
  router: NextLikeRouter,
  href: string,
): Promise<void> {
  await awaitGoogleTranslateDomRestoredForClientNavigation();
  if (isGoogleTranslateDomActive()) {
    window.location.assign(href);
    return;
  }
  router.push(href);
}
