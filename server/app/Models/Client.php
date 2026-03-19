<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    //
    protected $fillable = [
        'name',
        'industry',
        'fb_ad_account_id',
        'fb_access_token',
        'target_cpl'
    ];

    protected $casts = [
        // This automatically encrypts the token when saving 
        // and decrypts it when you call $client->fb_access_token
        'fb_access_token' => 'encrypted',
    ];

    public function fbReports(): HasMany
    {
        return $this->hasMany(FbReport::class);
    }
}
