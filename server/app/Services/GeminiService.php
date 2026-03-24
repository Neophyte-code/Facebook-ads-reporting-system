<?php

namespace App\Services;

use App\Models\Client;
use Gemini\Laravel\Facades\Gemini;

class GeminiService
{
    public function getAdInsights(Client $client)
    {
        // 1. Get the last 30 days of reports
        $reports = $client->fbReports()->orderBy('date', 'desc')->take(30)->get();

        if ($reports->isEmpty()) {
            return "No data found for this client to analyze.";
        }

        // 2. Calculate Aggregated Metrics
        $totalSpend = $reports->sum('spend');
        $totalClicks = $reports->sum('clicks');
        $totalImpressions = $reports->sum('impressions');
        $totalConversions = $reports->sum('conversions');

        $ctr = $totalImpressions > 0 ? ($totalClicks / $totalImpressions) * 100 : 0;
        $cpc = $totalClicks > 0 ? $totalSpend / $totalClicks : 0;
        $cpl = $totalConversions > 0 ? $totalSpend / $totalConversions : 0;

        // 3. Build the Prompt
        $prompt = "You are a Senior Media Buyer analyzing ads for a client in the {$client->industry} industry. 
        Target Cost Per Lead (CPL): " . ($client->target_cpl ?? 'Not set') . "
        
        Performance over the last 30 days:
        - Total Spend: {$totalSpend}
        - Total Clicks: {$totalClicks}
        - Total Impressions: {$totalImpressions}
        - Conversions (Leads): {$totalConversions}
        - CTR: " . number_format($ctr, 2) . "%
        - CPC: " . number_format($cpc, 2) . "
        - Current CPL: " . number_format($cpl, 2) . "

        Based on this data, provide 3 specific, actionable suggestions to improve lead generation and lower costs. 
        Keep the tone professional and helpful for a marketing agency.";

        // 4. Call Gemini
        $result = Gemini::generativeModel(model: 'gemini-2.5-flash')
            ->generateContent($prompt);

        return $result->text();
    }
}
