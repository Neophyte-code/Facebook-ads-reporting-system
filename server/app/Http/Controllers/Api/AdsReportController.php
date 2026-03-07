<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FbReport;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdsReportController extends Controller
{
    public function index(Request $request)
    {
        // Get the period from the URL (e.g., ?period=weekly), default to 'weekly'
        $period = $request->query('period', 'weekly');

        $query = FbReport::query();

        // Filter based on the requested period
        if ($period === 'weekly') {
            $query->where('date', '>=', Carbon::now()->subDays(7));
        } elseif ($period === 'monthly') {
            $query->where('date', '>=', Carbon::now()->subDays(30));
        }

        // Get the data sorted by date for the chart
        $reports = $query->orderBy('date', 'asc')->get();

        // Calculate Totals for the "Cards" at the top of your dashboard
        $stats = [
            'total_spend' => $reports->sum('spend'),
            'total_clicks' => $reports->sum('clicks'),
            'total_impressions' => $reports->sum('impressions'),
            // Calculate CTR: (Clicks / Impressions) * 100
            'avg_ctr' => $reports->sum('impressions') > 0
                ? round(($reports->sum('clicks') / $reports->sum('impressions')) * 100, 2)
                : 0,
        ];

        return response()->json([
            'status' => 'success',
            'period' => $period,
            'summary' => $stats,
            'data' => $reports // This array goes directly into your Next.js Line Chart
        ]);
    }
}
