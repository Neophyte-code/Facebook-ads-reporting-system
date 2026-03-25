<?php

use App\Http\Controllers\Api\AdsReportController;
use Illuminate\Support\Facades\Route;
use App\Services\FacebookAdsService;
use App\Http\Controllers\Api\AdInsightController;


Route::get('/ads-report', [AdsReportController::class, 'index']);

Route::get('/test-fb-sync/{id}', function ($id, FacebookAdsService $fbService) {
    return response()->json($fbService->syncDailyReports($id));
});

Route::get('/clients/{client}/insights', [AdInsightController::class, 'showInsights']);

Route::get('/clients', function () {
    return \App\Models\Client::select('id', 'name')->get();
});
