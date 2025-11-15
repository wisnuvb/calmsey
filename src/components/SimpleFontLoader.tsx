"use client";

import { useEffect } from "react";

export function SimpleFontLoader() {
  useEffect(() => {
    // Simple font loading - just add the CSS links
    const workSansLink = document.createElement("link");
    workSansLink.href =
      "https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap";
    workSansLink.rel = "stylesheet";
    workSansLink.crossOrigin = "anonymous";

    const nunitoSansLink = document.createElement("link");
    nunitoSansLink.href =
      "https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap";
    nunitoSansLink.rel = "stylesheet";
    nunitoSansLink.crossOrigin = "anonymous";

    // Check if already loaded
    if (!document.querySelector('link[href*="Work+Sans"]')) {
      document.head.appendChild(workSansLink);
    }
    if (!document.querySelector('link[href*="Nunito+Sans"]')) {
      document.head.appendChild(nunitoSansLink);
    }
  }, []);

  return null;
}
