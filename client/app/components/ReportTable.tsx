import type { FbReportRecord } from "@/types/ads-report";
import { formatDate, formatCurrency, formatNumber } from "@/lib/utils";

interface ReportTableProps {
  records: FbReportRecord[];
}

export function ReportTable({ records }: ReportTableProps) {
  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/50 ring-1 ring-stone-800 overflow-hidden shadow-lg shadow-black/10">
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
                {formatCurrency(row.spend)}
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
    </div>
  );
}
