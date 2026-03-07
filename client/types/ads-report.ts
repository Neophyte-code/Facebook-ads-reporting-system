export interface FbReportRecord {
  id?: number;
  ad_account_id: string;
  date: string;
  spend: string | number;
  impressions: number;
  reach: number;
  clicks: number;
  post_engagement: number;
  conversions: number;
}

export interface AdsReportSummary {
  total_spend: number;
  total_clicks: number;
  total_impressions: number;
  avg_ctr: number;
}

export type AdsReportPeriod = "weekly" | "monthly";

export interface AdsReportResponse {
  status: string;
  period: AdsReportPeriod;
  summary: AdsReportSummary;
  data: FbReportRecord[];
}
