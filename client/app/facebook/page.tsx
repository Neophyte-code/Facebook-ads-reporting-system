"use client";

import { useEffect, useState } from "react";
import type {
  AdsReportPeriod,
  AdsReportResponse,
  FbReportRecord,
} from "@/types/ads-report";
import { Sidebar } from "../components/Sidebar";
import { ComboboxBasic } from "../components/ComboboxBasic";
import { AIInsightCard } from "../components/AIInsightCard";

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

export default function facebookAdsReport() {
  const [period, setPeriod] = useState<AdsReportPeriod>("weekly");
  const [data, setData] = useState<AdsReportResponse | null>(null);
  const [loading, setLoading] = useState(false); // Start as false until a client is picked
  const [error, setError] = useState<string | null>(null);

  // client id
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we actually have a client selected
    if (!selectedClientId) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(
      `${API_BASE}/api/ads-report?period=${period}&client_id=${selectedClientId}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [period, selectedClientId]);

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-(--font-geist-sans)">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-stone-50 sm:text-3xl">
                  {/* Check if data exists AND if there is at least one row of records */}
                  {data && data.data.length > 0
                    ? `${data.data[0].client_name} Report`
                    : "Select a Client"}
                </h1>
                <p className="mt-1.5 text-sm text-stone-400">
                  Facebook ads performance by period
                </p>
              </div>

              {/* Period tabs */}
              <div className="flex gap-1 rounded-xl bg-stone-900/80 p-1.5 ring-1 ring-stone-800 shadow-inner">
                {(["weekly", "monthly"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      period === p
                        ? "bg-amber-500/20 text-amber-400 shadow-sm ring-1 ring-amber-500/40"
                        : "text-stone-400 hover:bg-stone-800/80 hover:text-stone-200"
                    }`}
                  >
                    {p === "weekly" ? "Last 7 days" : "Last 30 days"}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* STEP 3: Pass the change handler to your Combobox */}
          <div className="my-5 max-w-sm">
            <ComboboxBasic
              apiBase={API_BASE}
              onClientChange={(id) => setSelectedClientId(id)}
            />
          </div>

          {/* Error & Loading States */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3.5 text-red-300 shadow-lg">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-400" />
            </div>
          )}

          {/* Empty State: Prompt user to select a client */}
          {!loading && !selectedClientId && (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-stone-800 rounded-2xl">
              <p className="text-stone-500">
                Select a client above to view performance data.
              </p>
            </div>
          )}

          {/* Main Data Display */}
          {!loading && data && (
            <>
              {/* Summary cards (keep your existing Card section) */}
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

              <section className="mb-10">
                <AIInsightCard
                  clientId={Number(selectedClientId)}
                  apiBase={API_BASE}
                  period={period}
                />
              </section>

              {/* Data table */}
              <section className="rounded-xl border border-stone-800 bg-stone-900/50 ring-1 ring-stone-800 overflow-hidden shadow-lg shadow-black/10">
                <Table records={data.data} />
              </section>
            </>
          )}
        </div>
      </main>
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
      className={`rounded-xl border border-stone-800 bg-stone-900/80 p-5 ring-1 ${ring} shadow-lg shadow-black/5 transition-shadow hover:shadow-xl hover:shadow-black/10`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold tabular-nums text-stone-50 sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function Table({ records }: { records: FbReportRecord[] }) {
  return (
    <table className="min-w-full divide-y divide-stone-800">
      <thead>
        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
          <th className="px-4 py-3.5 sm:px-6">Date</th>
          <th className="px-4 py-3.5 sm:px-6">Spend</th>
          <th className="px-4 py-3.5 sm:px-6">Impressions</th>
          <th className="px-4 py-3.5 sm:px-6">Reach</th>
          <th className="px-4 py-3.5 sm:px-6">Clicks</th>
          <th className="px-4 py-3.5 sm:px-6">Engagement</th>
          <th className="px-4 py-3.5 sm:px-6">Conversions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-800/80 bg-stone-950/30">
        {records.map((row, i) => (
          <tr
            key={row.date + (row.ad_account_id ?? "") + i}
            className="text-stone-300 transition-colors hover:bg-stone-800/40"
          >
            <td className="whitespace-nowrap px-4 py-3.5 sm:px-6 font-medium text-stone-200">
              {formatDate(row.date)}
            </td>
            <td className="whitespace-nowrap px-4 py-3.5 sm:px-6 tabular-nums">
              {formatCurrency(Number(row.spend))}
            </td>
            <td className="whitespace-nowrap px-4 py-3.5 sm:px-6 tabular-nums">
              {formatNumber(row.impressions)}
            </td>
            <td className="whitespace-nowrap px-4 py-3.5 sm:px-6 tabular-nums">
              {formatNumber(row.reach)}
            </td>
            <td className="whitespace-nowrap px-4 py-3.5 sm:px-6 tabular-nums">
              {formatNumber(row.clicks)}
            </td>
            <td className="whitespace-nowrap px-4 py-3.5 sm:px-6 tabular-nums">
              {formatNumber(row.post_engagement)}
            </td>
            <td className="whitespace-nowrap px-4 py-3.5 sm:px-6 tabular-nums">
              {formatNumber(row.conversions)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
