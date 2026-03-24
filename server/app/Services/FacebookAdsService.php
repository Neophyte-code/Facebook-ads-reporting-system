<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FacebookAdsService
{
    public function syncDailyReports($clientId)
    {
        $client = \App\Models\Client::findOrFail($clientId);

        // Use the client's actual stored (and decrypted) token
        $accessToken = $client->fb_access_token;
        $adAccountId = $client->fb_ad_account_id;

        $formattedId = str_starts_with($adAccountId, 'act_') ? $adAccountId : 'act_' . $adAccountId;

        $response = Http::get("https://graph.facebook.com/v25.0/{$formattedId}/insights", [
            'fields' => 'account_id,date_start,spend,impressions,clicks,reach,actions',
            'date_preset' => 'last_30d',
            'time_increment' => 1,
            'access_token' => $accessToken,
        ]);

        if ($response->failed()) {
            return "Failed! Error: " . $response->json()['error']['message'];
        }

        return "Connected! Data received: " . count($response->json()['data'] ?? []);
    }
}
