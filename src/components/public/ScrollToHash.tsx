"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls to the element matching the URL hash when navigating to a page with a hash
 * (e.g. /en/about-us#ourteam). Needed because Next.js client-side navigation doesn't
 * trigger the browser's default hash-scroll behavior.
 * Uses scroll-margin-top from globals.css to offset the fixed navbar.
 */
export function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const hash =
      typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (!hash) return;

    const scrollToElement = () => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Delay to allow DOM to render (sections may load asynchronously)
    const timer = setTimeout(scrollToElement, 100);

    return () => clearTimeout(timer);
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
