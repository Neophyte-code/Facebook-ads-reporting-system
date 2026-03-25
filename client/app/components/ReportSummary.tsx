import { formatCurrency, formatNumber } from "@/lib/utils";

interface ReportSummaryProps {
  summary: {
    total_spend: number;
    total_clicks: number;
    total_impressions: number;
    avg_ctr: number;
  };
}

export function ReportSummary({ summary }: ReportSummaryProps) {
  return (
    <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        label="Total spend"
        value={formatCurrency(summary.total_spend)}
        accent="amber"
      />
      <SummaryCard
        label="Clicks"
        value={formatNumber(summary.total_clicks)}
        accent="emerald"
      />
      <SummaryCard
        label="Impressions"
        value={formatNumber(summary.total_impressions)}
        accent="sky"
      />
      <SummaryCard
        label="Avg. CTR"
        value={`${summary.avg_ctr}%`}
        accent="violet"
      />
    </section>
  );
}

function SummaryCard({
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
