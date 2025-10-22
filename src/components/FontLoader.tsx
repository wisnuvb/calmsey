"use client";

import { useEffect } from "react";
import { GoogleFontsService } from "@/lib/fonts/google-fonts";

export function FontLoader() {
  useEffect(() => {
    // Load Work Sans dengan berbagai weight
    GoogleFontsService.loadFont(
      "Work Sans",
      ["300", "400", "500", "600", "700"],
      ["normal", "italic"]
    );

    // Load Nunito Sans dengan berbagai weight
    GoogleFontsService.loadFont(
      "Nunito Sans",
      ["300", "400", "500", "600", "700"],
      ["normal", "italic"]
    );
  }, []);

  return null;
}
