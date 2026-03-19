<?php

namespace App\Services;

use App\Models\FbReport;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class FacebookAdsService
{
    // Best practice: Move these to your .env file later
    protected $accessToken = 'EAAUpjKS297QBQ168gNvUVaZAgRbG7nPfjoVJhaxfp10VmIfWsOvVsjAPiWe31p5vcQYrvcJBzqYzd1cb7DVgzRnszHLTwtdKzeNfx0tHCdIi9r9jTXVyti8ZBKJXZCSX8bJIg7yeZBSLZBDkRO6rzbnTmTSLEicCOvtyCdQQ8GMERxw4sjaqEpF8bBEZAk4xcAoZCZAd40Wr8guS6ZBhkepuP3GEtkINZAUh4Mpx1pL0inkhKBucAMeUlqwiFfZA73fJfePHNBEXH6kZALcruPheUgLG77sZBlRJ4ygZDZD';
    protected $adAccountId = '117945942017721';

    public function syncDailyReports($days = 30)
    {
        $formattedId = str_starts_with($this->adAccountId, 'act_')
            ? $this->adAccountId
            : 'act_' . $this->adAccountId;

        // 1. Fetch data from Facebook
        $response = Http::get("https://graph.facebook.com/v20.0/{$formattedId}/insights", [
            'fields' => 'account_id,date_start,spend,impressions,clicks,reach,actions',
            'date_preset' => 'last_30d',
            'time_increment' => 1,
            'access_token' => $this->accessToken,
        ]);

        // 2. Verify Connection
        if ($response->failed()) {
            Log::error("FB API Error: " . $response->body());
            return [
                'success' => false,
                'message' => "Connection Failed: " . ($response->json()['error']['message'] ?? 'Unknown error'),
                'status_code' => $response->status()
            ];
        }

        $data = $response->json()['data'] ?? [];

        if (empty($data)) {
            return [
                'success' => true,
                'message' => "Connected, but no ad data found for this period.",
                'count' => 0
            ];
        }

        // 3. Process and Save to Database
        foreach ($data as $day) {
            // Extract specific actions from the nested array
            $actions = collect($day['actions'] ?? []);

            // Post Engagement usually maps to 'post_engagement' action type
            $postEngagement = $actions->firstWhere('action_type', 'post_engagement')['value'] ?? 0;

            // Conversions: You can sum specific types or use 'offsite_conversion.fb_pixel_purchase'
            $conversions = $actions->whereIn('action_type', [
                'offsite_conversion.fb_pixel_purchase',
                'lead',
                'contact'
            ])->sum('value') ?? 0;

            FbReport::updateOrCreate(
                [
                    'ad_account_id' => $day['account_id'],
                    'date'          => $day['date_start'],
                ],
                [
                    'spend'           => $day['spend'] ?? 0,
                    'impressions'     => $day['impressions'] ?? 0,
                    'clicks'          => $day['clicks'] ?? 0,
                    'reach'           => $day['reach'] ?? 0,
                    'post_engagement' => $postEngagement,
                    'conversions'     => $conversions,
                ]
            );
        }

        return [
            'success' => true,
            'message' => count($data) . " days of real data synced successfully!",
            'count' => count($data)
        ];
    }
}
