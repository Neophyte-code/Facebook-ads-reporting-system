<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Services\AdService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;

class AdInsightController extends Controller
{
    protected $adService;

    public function __construct(AdService $adService)
    {
        $this->adService = $adService;
    }

    public function showInsights(Request $request, Client $client): JsonResponse
    {
        try {

            $period = $request->query('period', 'weekly');

            $cacheKey = "client_insights_{$client->id}_{$period}";

            $insight = Cache::remember($cacheKey, 3600, function () use ($client, $period) {
                return $this->adService->getInsights($client, $period);
            });

            return response()->json([
                'status' => 'success',
                'client_name' => $client->name,
                'period' => $period,
                'ai_advice' => $insight
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Could not generate insights at this time.',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
