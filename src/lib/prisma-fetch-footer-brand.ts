import { prisma } from "@/lib/prisma";
import type { FooterBrand } from "@prisma/client";

/** Returns footer brand row, or null if missing / table not migrated yet. */
export async function findFooterBrandSafe(): Promise<FooterBrand | null> {
  try {
    return await prisma.footerBrand.findUnique({ where: { id: "singleton" } });
  } catch {
    console.warn("[footer_brand] findUnique failed (migrate DB or run prisma generate)");
    return null;
  }
}
