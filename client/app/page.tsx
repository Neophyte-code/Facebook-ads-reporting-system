"use client";

import { useEffect, useState } from "react";
import type {
  AdsReportPeriod,
  AdsReportResponse,
  FbReportRecord,
} from "@/types/ads-report";

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
    : "";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  const [period, setPeriod] = useState<AdsReportPeriod>("weekly");
  const [data, setData] = useState<AdsReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/api/ads-report?period=${period}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        return res.json();
      })
      .then((json: AdsReportResponse) => {
        setData(json);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [period]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-[var(--font-geist-sans)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-50 sm:text-3xl">
            Ads Report
          </h1>
          <p className="mt-1 text-stone-400">
            Facebook ads performance by period
          </p>
        </header>

        {/* Period tabs */}
        <div className="mb-8 flex gap-1 rounded-lg bg-stone-900/80 p-1 ring-1 ring-stone-800 w-fit">
          {(["weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                period === p
                  ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {p === "weekly" ? "Last 7 days" : "Last 30 days"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-red-300">
            {error}. Ensure the API is running (e.g.{" "}
            <code className="rounded bg-stone-800 px-1">php artisan serve</code>
            ) and{" "}
            <code className="rounded bg-stone-800 px-1">
              NEXT_PUBLIC_API_URL
            </code>{" "}
            points to it.
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500/50 border-t-amber-400" />
          </div>
        )}

        {!loading && data && (
          <>
            {/* Summary cards */}
            <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card
                label="Total spend"
                value={formatCurrency(data.summary.total_spend)}
                accent="amber"
              />
              <Card
                label="Clicks"
                value={formatNumber(data.summary.total_clicks)}
                accent="emerald"
              />
              <Card
                label="Impressions"
                value={formatNumber(data.summary.total_impressions)}
                accent="sky"
              />
              <Card
                label="Avg. CTR"
                value={`${data.summary.avg_ctr}%`}
                accent="violet"
              />
            </section>

            {/* Data table */}
            <section className="rounded-xl border border-stone-800 bg-stone-900/50 ring-1 ring-stone-800 overflow-hidden">
              <div className="border-b border-stone-800 px-4 py-3 sm:px-6">
                <h2 className="text-sm font-medium text-stone-300">
                  Report records
                </h2>
                <p className="mt-0.5 text-xs text-stone-500">
                  {data.data.length} row{data.data.length !== 1 ? "s" : ""} in{" "}
                  {period} period
                </p>
              </div>
              <div className="overflow-x-auto">
                {data.data.length === 0 ? (
                  <div className="px-4 py-12 text-center text-stone-500 sm:px-6">
                    No records for this period.
                  </div>
                ) : (
                  <Table records={data.data} />
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "amber" | "emerald" | "sky" | "violet";
}) {
  const ring =
    accent === "amber"
      ? "ring-amber-500/20"
      : accent === "emerald"
        ? "ring-emerald-500/20"
        : accent === "sky"
          ? "ring-sky-500/20"
          : "ring-violet-500/20";
  return (
    <div
      className={`rounded-xl border border-stone-800 bg-stone-900/80 p-4 ring-1 ${ring}`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-stone-50 sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function Table({ records }: { records: FbReportRecord[] }) {
  return (
    <table className="min-w-full divide-y divide-stone-800">
      <thead>
        <tr className="text-left text-xs font-medium uppercase tracking-wider text-stone-500">
          <th className="px-4 py-3 sm:px-6">Date</th>
          <th className="px-4 py-3 sm:px-6">Spend</th>
          <th className="px-4 py-3 sm:px-6">Impressions</th>
          <th className="px-4 py-3 sm:px-6">Reach</th>
          <th className="px-4 py-3 sm:px-6">Clicks</th>
          <th className="px-4 py-3 sm:px-6">Engagement</th>
          <th className="px-4 py-3 sm:px-6">Conversions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-800/80">
        {records.map((row, i) => (
          <tr
            key={row.date + (row.ad_account_id ?? "") + i}
            className="text-stone-300 hover:bg-stone-800/50 transition-colors"
          >
            <td className="whitespace-nowrap px-4 py-3 sm:px-6 font-medium text-stone-200">
              {formatDate(row.date)}
            </td>
            <td className="whitespace-nowrap px-4 py-3 sm:px-6 tabular-nums">
              {formatCurrency(Number(row.spend))}
            </td>
            <td className="whitespace-nowrap px-4 py-3 sm:px-6 tabular-nums">
              {formatNumber(row.impressions)}
            </td>
            <td className="whitespace-nowrap px-4 py-3 sm:px-6 tabular-nums">
              {formatNumber(row.reach)}
            </td>
            <td className="whitespace-nowrap px-4 py-3 sm:px-6 tabular-nums">
              {formatNumber(row.clicks)}
            </td>
            <td className="whitespace-nowrap px-4 py-3 sm:px-6 tabular-nums">
              {formatNumber(row.post_engagement)}
            </td>
            <td className="whitespace-nowrap px-4 py-3 sm:px-6 tabular-nums">
              {formatNumber(row.conversions)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
