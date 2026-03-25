"use client"

import { useState, useEffect } from "react";
import type { AdsReportPeriod, AdsReportResponse } from "@/types/ads-report";

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
    : "";

export function useAdsReport() {
  const [period, setPeriod] = useState<AdsReportPeriod>("weekly");
  const [data, setData] = useState<AdsReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedClientId) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/ads-report?period=${period}&client_id=${selectedClientId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [period, selectedClientId]);

  const handleClientChange = (id: string | null, name: string | null) => {
    setSelectedClientId(id);
    setSelectedClientName(name);
  };

  return {
    period,
    setPeriod,
    data,
    loading,
    error,
    selectedClientId,
    selectedClientName,
    handleClientChange,
    apiBase: API_BASE,
  };
}