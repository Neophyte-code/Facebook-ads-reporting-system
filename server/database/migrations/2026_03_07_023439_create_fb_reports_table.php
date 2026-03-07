<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fb_reports', function (Blueprint $table) {
            $table->id();
            $table->string('ad_account_id');
            $table->date('date');

            // --- Financial Metrics ---
            $table->decimal('spend', 10, 2)->default(0); // Total cost

            // --- Delivery Metrics ---
            $table->integer('impressions')->default(0);  // Total views
            $table->integer('reach')->default(0);        // Unique people reached

            // --- Engagement Metrics ---
            $table->integer('clicks')->default(0);       // Link clicks
            $table->integer('post_engagement')->default(0); // Likes, shares, comments

            // --- Performance Metrics (Calculated or Raw) ---
            // Note: It's often better to store raw "actions" and calculate
            // CTR/CPC in your API so the math stays accurate across date ranges.
            $table->integer('conversions')->default(0);  // Key results (Purchases/Leads)

            $table->timestamps();
            $table->unique(['ad_account_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fb_reports');
    }
};
