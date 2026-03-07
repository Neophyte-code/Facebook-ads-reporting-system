<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FbReport extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ad_account_id',
        'date',
        'spend',
        'impressions',
        'reach',
        'clicks',
        'post_engagement',
        'conversions',
    ];

    /**
     * The attributes that should be cast to native types.
     * * This ensures 'spend' is always treated as a number, not a string.
     */
    protected $casts = [
        'date' => 'date',
        'spend' => 'decimal:2',
    ];
}
