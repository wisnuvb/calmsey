import fundDetailsData from "./data/fund-details.json";
import type { FundDetail, FundDetailsData } from "@/types/fund-detail";

const fundsData = fundDetailsData as FundDetailsData;

/**
 * Get all fund details
 */
export function getAllFundDetails(): FundDetail[] {
  return fundsData.funds;
}

/**
 * Get fund detail by ID
 */
export function getFundDetailById(id: string): FundDetail | undefined {
  return fundsData.funds.find((fund) => fund.id === id);
}

/**
 * Get fund detail by slug
 */
export function getFundDetailBySlug(slug: string): FundDetail | undefined {
  return fundsData.funds.find((fund) => fund.slug === slug);
}

/**
 * Get all fund slugs (for static generation)
 */
export function getAllFundSlugs(): string[] {
  return fundsData.funds.map((fund) => fund.slug);
}

/**
 * Get all fund IDs
 */
export function getAllFundIds(): string[] {
  return fundsData.funds.map((fund) => fund.id);
}
