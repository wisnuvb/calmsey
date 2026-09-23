"use client";

import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type StatRow = {
  modalSource: string;
  documentItemId: string | null;
  documentTitle: string | null;
  selectedOptionLabel: string;
  fileUrl: string;
  downloadCount: number;
  lastDownloadedAt: string;
};

export default function ResourceDownloadsAdminPage() {
  const [rows, setRows] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalSource, setModalSource] = useState<
    | ""
    | "ACTION_PLANS"
    | "PARTNERS"
    | "GRANTMAKING_FRAMEWORK"
    | "STRATEGY_2030"
    | "ANNUAL_REPORT"
    | "GUIDING_POLICIES"
    | "FUND_DETAIL"
  >("");
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [uniqueFiles, setUniqueFiles] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const onModalFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setModalSource(
      e.target.value as
        | ""
        | "ACTION_PLANS"
        | "PARTNERS"
        | "GRANTMAKING_FRAMEWORK"
        | "STRATEGY_2030"
        | "ANNUAL_REPORT"
        | "GUIDING_POLICIES"
        | "FUND_DETAIL",
    );
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search: debouncedSearch });
      if (modalSource) params.set("modalSource", modalSource);
      const res = await fetch(`/api/admin/resource-downloads?${params}`);
      const json = await res.json();
      if (res.ok) {
        setRows(json.data || []);
        setTotalDownloads(json.summary?.totalDownloads ?? 0);
        setUniqueFiles(json.summary?.uniqueFiles ?? 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, modalSource]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const modalLabel = (s: string) =>
    s === "ACTION_PLANS"
      ? "Action plans"
      : s === "PARTNERS"
        ? "Partners report"
        : s === "GRANTMAKING_FRAMEWORK"
          ? "Grantmaking framework"
          : s === "STRATEGY_2030"
            ? "Strategy to 2030"
            : s === "ANNUAL_REPORT"
              ? "Annual Report"
              : s === "GUIDING_POLICIES"
                ? "Guiding policies"
                : s === "FUND_DETAIL"
                  ? "Fund detail"
                  : s;

  return (
    <div id="main-content" className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Download Statistics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Anonymous download counts per file and language variant. No personal
            data is collected or shown.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="relative max-w-md flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search document, language, file…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="modal-filter" className="sr-only">
            Modal
          </label>
          <select
            id="modal-filter"
            value={modalSource}
            onChange={onModalFilterChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All modals</option>
            <option value="ACTION_PLANS">Action plans</option>
            <option value="PARTNERS">Partners report</option>
            <option value="GRANTMAKING_FRAMEWORK">Grantmaking framework</option>
            <option value="STRATEGY_2030">Strategy to 2030</option>
            <option value="ANNUAL_REPORT">Annual Report</option>
            <option value="GUIDING_POLICIES">Guiding policies</option>
            <option value="FUND_DETAIL">Fund detail</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
        <p>
          Total downloads:{" "}
          <span className="font-semibold text-gray-900">{totalDownloads}</span>
        </p>
        <p>
          Unique files:{" "}
          <span className="font-semibold text-gray-900">{uniqueFiles}</span>
        </p>
      </div>

      <div className="mt-4 flow-root overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No download statistics yet.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Document
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Variant
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Modal
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                  Downloads
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Last download
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  File
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rows.map((row) => (
                <tr key={`${row.fileUrl}-${row.selectedOptionLabel}-${row.modalSource}-${row.documentItemId ?? ""}`}>
                  <td className="max-w-xs px-3 py-3 text-sm text-gray-900">
                    {row.documentTitle ? (
                      <span className="line-clamp-2">{row.documentTitle}</span>
                    ) : row.documentItemId ? (
                      <span className="text-gray-600">{row.documentItemId}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-700">
                    {row.selectedOptionLabel}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-700">
                    {modalLabel(row.modalSource)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-sm font-semibold text-gray-900">
                    {row.downloadCount}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600">
                    {new Date(row.lastDownloadedAt).toLocaleString()}
                  </td>
                  <td className="max-w-[220px] px-3 py-3 text-sm">
                    <a
                      href={row.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-blue-600 hover:underline"
                    >
                      {row.fileUrl}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
