<?php

use App\Http\Controllers\Api\AdsReportController;
use Illuminate\Support\Facades\Route;
use App\Services\FacebookAdsService;


Route::get('/ads-report', [AdsReportController::class, 'index']);

Route::get('/test-fb-sync', function (FacebookAdsService $fbService) {
    return response()->json($fbService->syncDailyReports());
});
