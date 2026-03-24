<?php

use App\Http\Controllers\Api\AdsReportController;
use Illuminate\Support\Facades\Route;
use App\Services\FacebookAdsService;
use App\Http\Controllers\Api\AdInsightController;
use App\Services\GeminiService;
use App\Models\Client;


Route::get('/ads-report', [AdsReportController::class, 'index']);

Route::get('/test-fb-sync/{id}', function ($id, FacebookAdsService $fbService) {
    return response()->json($fbService->syncDailyReports($id));
});

Route::get('/clients/{client}/ai-insights', [AdInsightController::class, 'generate']);

Route::get('/test-ai', function (GeminiService $ai) {
    $client = Client::find(5);
    return $ai->getAdInsights($client);
});
