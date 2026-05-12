"use client";

import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Row = {
  id: string;
  fullName: string;
  email: string;
  countryCode: string;
  countryLabel: string;
  modalSource: string;
  documentItemId: string | null;
  documentTitle: string | null;
  selectorType: string;
  selectedOptionLabel: string;
  fileUrl: string;
  createdAt: string;
};

export default function ResourceDownloadsAdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalSource, setModalSource] = useState<
    "" | "ACTION_PLANS" | "PARTNERS" | "GRANTMAKING_FRAMEWORK"
  >("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const onModalFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setModalSource(
      e.target.value as
        | ""
        | "ACTION_PLANS"
        | "PARTNERS"
        | "GRANTMAKING_FRAMEWORK",
    );
    setPage(1);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        page: String(page),
        limit: "25",
      });
      if (modalSource) params.set("modalSource", modalSource);
      const res = await fetch(`/api/admin/resource-downloads?${params}`);
      const json = await res.json();
      if (res.ok) {
        setRows(json.data || []);
        setTotalPages(json.pagination?.totalPages ?? 1);
        setTotal(json.pagination?.total ?? 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, modalSource, page]);

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
          : s;

  return (
    <div id="main-content" className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Download Activity
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Submissions from resource download lead forms (Where We Work,
            Grantmaking Framework, etc.).
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="relative max-w-md flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search name, email, country, file…"
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
          </select>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-600">
        Total: <span className="font-medium">{total}</span>
      </p>

      <div className="mt-4 flow-root overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No submissions yet.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Date
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Name / Email
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Country
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Modal
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Document / variant
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  File
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rows.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-sm">
                    <div className="font-medium text-gray-900">
                      {r.fullName}
                    </div>
                    <div className="text-gray-600">{r.email}</div>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900">
                    {r.countryLabel}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">
                    {modalLabel(r.modalSource)}
                  </td>
                  <td className="max-w-xs px-3 py-3 text-sm text-gray-700">
                    {r.documentTitle ? (
                      <span className="line-clamp-2">{r.documentTitle}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                    <div className="mt-0.5 text-xs text-gray-500">
                      {r.selectorType}: {r.selectedOptionLabel}
                    </div>
                  </td>
                  <td className="max-w-[200px] px-3 py-3 text-sm">
                    <a
                      href={r.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-blue-600 hover:underline"
                    >
                      {r.fileUrl}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="py-1 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
