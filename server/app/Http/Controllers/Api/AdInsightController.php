<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Services\AdService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class AdInsightController extends Controller
{
    protected $adService;

    public function __construct(AdService $adService)
    {
        $this->adService = $adService;
    }

    public function showInsights(Client $client): JsonResponse
    {
        try {
            // Create a unique cache key for this specific client
            $cacheKey = "client_insights_{$client->id}";

            /**
             * Cache::remember() does 3 things:
             * 1. Checks if the key exists.
             * 2. If yes, returns it immediately (No API call!).
             * 3. If no, runs the function, saves the result for 3600 seconds (1 hour), and returns it.
             */
            $insight = Cache::remember($cacheKey, 3600, function () use ($client) {
                return $this->adService->getInsights($client);
            });

            return response()->json([
                'status' => 'success',
                'cached' => Cache::has($cacheKey),
                'client_name' => $client->name,
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
