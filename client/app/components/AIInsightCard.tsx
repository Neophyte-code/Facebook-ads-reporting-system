"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, AlertCircle, TrendingUp } from "lucide-react";

interface AIInsightProps {
  clientId: number | null;
  apiBase: string;
  period: string;
}

export function AIInsightCard({ clientId, apiBase, period }: AIInsightProps) {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Track if we have performed the initial fetch for this specific selection
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const fetchInsight = async () => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    try {
      // We add a 'cache_bust' param just to be 100% sure we bypass old browser cache
      const response = await fetch(
        `${apiBase}/api/clients/${clientId}/insights?period=${period}&t=${Date.now()}`,
      );
      const data = await response.json();
      setInsight(data.ai_advice);
      setHasFetched(true);
    } catch (err) {
      setError("Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  // Reset the 'hasFetched' state when client or period changes
  // so the user has to click "Generate" for the NEW selection.
  useEffect(() => {
    setHasFetched(false);
    setInsight("");
  }, [clientId, period]);

  if (!clientId) return null;

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/50 overflow-hidden shadow-lg">
      <div className="border-b border-stone-800 bg-stone-800/30 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-stone-100">
            AI Performance Analysis
          </h3>
        </div>
      </div>

      <div className="p-8 flex flex-col items-center justify-center min-h-[200px]">
        {loading ? (
          <div className="text-center space-y-4">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-stone-400 text-sm italic">
              Analyzing {period} data...
            </p>
          </div>
        ) : hasFetched && insight ? (
          <div className="space-y-4 w-full text-left">
            {insight.split("\n\n").map((p, i) => (
              <p key={i} className="text-stone-300 leading-relaxed text-sm">
                {p}
              </p>
            ))}
            <button
              onClick={fetchInsight}
              className="mt-4 text-xs text-stone-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Regenerate
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-stone-400 mb-6 text-sm">
              Click to generate a custom {period} report for this client.
            </p>
            <button
              onClick={fetchInsight}
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-amber-500/10 active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate {period === "weekly" ? "7-Day" : "30-Day"} Insight
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
