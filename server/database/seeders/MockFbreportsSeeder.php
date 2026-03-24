<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MockFbreportsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clientId = 5;
        $startDate = now()->subDays(7);

        for ($i = 0; $i < 7; $i++) {
            \App\Models\FbReport::create([
                'client_id' => $clientId,
                'date' => $startDate->copy()->addDays($i),
                'spend' => rand(40, 60),        // Spending $40-$60 a day
                'impressions' => rand(1000, 1500),
                'reach' => rand(800, 1200),
                'clicks' => rand(10, 25),      // Low clicks = Low CTR
                'post_engagement' => rand(5, 15),
                'conversions' => rand(0, 1),    // Very few leads!
            ]);
        }
    }
}
