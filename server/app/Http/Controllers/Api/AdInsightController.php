<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Services\GeminiService;
use Illuminate\Http\Request;

class AdInsightController extends Controller
{
    protected $gemini;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;
    }

    public function generate(Request $request, $clientId)
    {
        $client = Client::findOrFail($clientId);

        $insight = $this->gemini->getAdInsights($client);

        return response()->json([
            'client_name' => $client->name,
            'insight' => $insight
        ]);
    }
}
