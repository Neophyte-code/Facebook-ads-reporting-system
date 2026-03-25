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
        // 1. You MUST pass a client_id from Next.js now
        $clientId = $request->query('client_id');
        $period = $request->query('period', 'weekly');

        if (!$clientId) {
            return response()->json(['status' => 'error', 'message' => 'client_id is required'], 400);
        }

        // 2. Filter query by the specific client
        $query = FbReport::where('fb_reports.client_id', $clientId)
            ->join('clients', 'fb_reports.client_id', '=', 'clients.id')
            ->select('fb_reports.*', 'clients.name as client_name');

        if ($period === 'weekly') {
            $query->where('date', '>=', Carbon::now()->subDays(7));
        } elseif ($period === 'monthly') {
            $query->where('date', '>=', Carbon::now()->subDays(30));
        }

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
            'data' => $reports
        ]);
    }
}
