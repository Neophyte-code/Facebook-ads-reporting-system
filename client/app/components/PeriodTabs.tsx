import type { AdsReportPeriod } from "@/types/ads-report";

interface PeriodTabsProps {
  period: AdsReportPeriod;
  onChange: (period: AdsReportPeriod) => void;
}

export function PeriodTabs({ period, onChange }: PeriodTabsProps) {
  const periods: { id: AdsReportPeriod; label: string }[] = [
    { id: "weekly", label: "Last 7 days" },
    { id: "monthly", label: "Last 30 days" },
  ];

  return (
    <div className="flex gap-1 rounded-xl bg-stone-900/80 p-1.5 ring-1 ring-stone-800 shadow-inner">
      {periods.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            period === p.id
              ? "bg-amber-500/20 text-amber-400 shadow-sm ring-1 ring-amber-500/40"
              : "text-stone-400 hover:bg-stone-800/80 hover:text-stone-200"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
