<?php

namespace App\Services;

use App\Models\Client;
use App\Ai\Agents\AdInsightAgent;
use Illuminate\Support\Collection;

class AdService
{
    public function getInsights(Client $client): string
    {
        // Fetch the last 7 days of data
        $reports = $client->fbReports()
            ->orderBy('date', 'desc')
            ->take(7)
            ->get();

        if ($reports->isEmpty()) {
            return "No recent ad data found for this client to analyze.";
        }

        //Prepare the data for the Agent
        $stats = $this->calculateMetrics($reports);

        // Instantiate the Agent
        $agent = new AdInsightAgent($client, $stats);

        // Send the prompt to the Agent
        return $agent->prompt($this->buildPromptBody($client, $stats));
    }

    /**
     * Calculate aggregated metrics from the reports.
     */
    private function calculateMetrics(Collection $reports): array
    {
        $totalSpend = $reports->sum('spend');
        $totalClicks = $reports->sum('clicks');
        $totalImpressions = $reports->sum('impressions');
        $totalConversions = $reports->sum('conversions');

        return [
            'spend'       => $totalSpend,
            'clicks'      => $totalClicks,
            'impressions' => $totalImpressions,
            'conversions' => $totalConversions,
            'ctr'         => $totalImpressions > 0 ? ($totalClicks / $totalImpressions) * 100 : 0,
            'cpc'         => $totalClicks > 0 ? $totalSpend / $totalClicks : 0,
            'cpl'         => $totalConversions > 0 ? $totalSpend / $totalConversions : 0,
        ];
    }

    /**
     * Format the data string sent to the Agent.
     */
    private function buildPromptBody(Client $client, array $stats): string
    {
        return sprintf(
            "Client Industry: %s\nTarget CPL: %s\n\nLatest 30-Day Stats:\n- Spend: %s\n- Conversions: %d\n- CTR: %.2f%%\n- Current CPL: %.2f\n\nPlease provide 3 actionable improvements.",
            $client->industry,
            $client->target_cpl ?? 'Not set',
            number_format($stats['spend'], 2),
            $stats['conversions'],
            $stats['ctr'],
            $stats['cpl']
        );
    }
}
