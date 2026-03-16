"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls to the element matching the URL hash when navigating to a page with a hash
 * (e.g. /en/about-us#ourteam). Needed because Next.js client-side navigation doesn't
 * trigger the browser's default hash-scroll behavior.
 * Uses scroll-margin-top from globals.css to offset the fixed navbar.
 *
 * Uses retry + MutationObserver because target elements (e.g. #ourteam in TeamSection)
 * may render late on first load/reload - client components mount progressively.
 */
export function ScrollToHash() {
  const pathname = usePathname();
  const scrollAttemptedRef = useRef(false);

  useEffect(() => {
    const hash =
      typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (!hash) return;

    scrollAttemptedRef.current = false;

    const scrollToElement = (): boolean => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    // Retry at intervals - client sections may mount late (TeamSection, etc.)
    const delays = [50, 150, 350, 600, 1000, 1500];
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (const delay of delays) {
      const timer = setTimeout(() => {
        if (scrollAttemptedRef.current) return;
        if (scrollToElement()) {
          scrollAttemptedRef.current = true;
        }
      }, delay);
      timers.push(timer);
    }

    // MutationObserver: scroll as soon as target element appears in DOM
    const mainContent = document.getElementById("main-content");
    const observerTarget = mainContent ?? document.body;

    const observer = new MutationObserver(() => {
      if (scrollAttemptedRef.current) return;
      if (scrollToElement()) {
        scrollAttemptedRef.current = true;
        observer.disconnect();
      }
    });

    observer.observe(observerTarget, {
      childList: true,
      subtree: true,
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
      observer.disconnect();
    };
  }, [pathname]);

  // Also handle hash change on same page (e.g. in-page anchor clicks)
  useEffect(() => {
    const handleHashChange = () => {
      const hash =
        typeof window !== "undefined" ? window.location.hash.slice(1) : "";
      if (!hash) return;
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return null;
}
