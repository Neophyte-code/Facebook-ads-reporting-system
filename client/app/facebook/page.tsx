"use client";

import { Sidebar } from "../components/Sidebar";
import { ComboboxBasic } from "../components/ComboboxBasic";
import { AIInsightCard } from "../components/AIInsightCard";
import { ReportTable } from "../components/ReportTable";
import { ReportSummary } from "../components/ReportSummary";
import { PeriodTabs } from "../components/PeriodTabs";
import { useAdsReport } from "../../hooks/useAdsReport";

export default function facebookAdsReport() {
  const {
    period,
    setPeriod,
    data,
    loading,
    error,
    selectedClientId,
    selectedClientName,
    handleClientChange,
    apiBase,
  } = useAdsReport();

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
                  {selectedClientName
                    ? `${selectedClientName} Report`
                    : "Select a Client"}
                </h1>
                <p className="mt-1.5 text-sm text-stone-400">
                  Facebook ads performance by period
                </p>
              </div>

              {/* Period tabs */}
              <div className="flex gap-1 rounded-xl bg-stone-900/80 p-1.5 ring-1 ring-stone-800 shadow-inner">
                <PeriodTabs period={period} onChange={setPeriod} />
              </div>
            </div>
          </header>

          <div className="my-5 max-w-sm">
            <ComboboxBasic
              apiBase={apiBase}
              onClientChange={handleClientChange}
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

          {/* Prompt user to select a client */}
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
              {/* Summary cards */}
              <ReportSummary summary={data.summary} />

              {/* AI Insight section */}
              <section className="mb-10">
                <AIInsightCard
                  clientId={Number(selectedClientId)}
                  apiBase={apiBase}
                  period={period}
                />
              </section>

              {/* Data table */}
              <section className="mb-10">
                <ReportTable records={data.data} />
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
