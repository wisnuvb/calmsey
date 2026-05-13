"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls to the element matching the URL hash when navigating to a page with a hash
 * (e.g. /en/about-us#ourteam). Needed because Next.js client-side navigation doesn't
 * trigger the browser's default hash-scroll behavior.
 * Uses scroll-margin-top from globals.css to offset the fixed navbar.
 *
 * Uses retry + MutationObserver because target elements (e.g. #ourteam in TeamSection)
 * may render late on first load/reload - client components mount progressively.
 *
 * Also handles `hashchange` with the same retry path: when locale forces
 * `window.location.href` to the same pathname with a new hash, the document often does
 * not reload, so the pathname-based effect does not re-run and a one-shot scroll was
 * too fragile.
 */
export function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const getHashId = () => {
      const raw =
        typeof window !== "undefined" ? window.location.hash.slice(1) : "";
      if (!raw) return "";
      try {
        return decodeURIComponent(raw.split("?")[0] ?? "");
      } catch {
        return raw.split("?")[0] ?? "";
      }
    };

    const scrollAttemptedRef = { current: false };

    const scrollToElement = (hashId: string): boolean => {
      if (!hashId) return false;
      const element = document.getElementById(hashId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    let cleanupScroll: (() => void) | undefined;

    const runHashScroll = (hashId: string) => {
      cleanupScroll?.();
      cleanupScroll = undefined;

      if (!hashId) return;

      scrollAttemptedRef.current = false;

      const delays = [50, 150, 350, 600, 1000, 1500];
      const timers: ReturnType<typeof setTimeout>[] = [];

      for (const delay of delays) {
        const timer = setTimeout(() => {
          if (scrollAttemptedRef.current) return;
          if (scrollToElement(hashId)) {
            scrollAttemptedRef.current = true;
          }
        }, delay);
        timers.push(timer);
      }

      const mainContent = document.getElementById("main-content");
      const observerTarget = mainContent ?? document.body;

      const observer = new MutationObserver(() => {
        if (scrollAttemptedRef.current) return;
        if (scrollToElement(hashId)) {
          scrollAttemptedRef.current = true;
          observer.disconnect();
        }
      });

      observer.observe(observerTarget, {
        childList: true,
        subtree: true,
      });

      cleanupScroll = () => {
        timers.forEach((t) => clearTimeout(t));
        observer.disconnect();
      };
    };

    const tick = () => {
      runHashScroll(getHashId());
    };

    tick();

    const onHashChange = () => {
      tick();
    };

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      cleanupScroll?.();
    };
  }, [pathname]);

  return null;
}
