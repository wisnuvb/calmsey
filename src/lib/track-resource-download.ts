export type ResourceDownloadModalSource =
  | "ACTION_PLANS"
  | "PARTNERS"
  | "GRANTMAKING_FRAMEWORK"
  | "STRATEGY_2030"
  | "ANNUAL_REPORT"
  | "GUIDING_POLICIES"
  | "FUND_DETAIL";

export type TrackResourceDownloadPayload = {
  modalSource: ResourceDownloadModalSource;
  documentItemId?: string | null;
  documentTitle?: string | null;
  selectorType: "language" | "country";
  selectedOptionLabel: string;
  fileUrl: string;
};

/** Fire-and-forget anonymous download event; must not block the file download. */
export function trackResourceDownload(
  payload: TrackResourceDownloadPayload,
): void {
  void fetch("/api/resource-downloads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Analytics failure must not affect UX.
  });
}
