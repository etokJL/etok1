<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'wallet_address',
        'email',
        'username',
        'is_active',
        'eligible_for_airdrops',
        'metadata'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'eligible_for_airdrops' => 'boolean',
        'metadata' => 'array'
    ];

    /**
     * Get all tokens owned by this user
     */
    public function tokens()
    {
        return $this->hasMany(AppToken::class, 'owner_address', 'wallet_address');
    }

    /**
     * Scope for active users only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for airdrop eligible users
     */
    public function scopeEligibleForAirdrops($query)
    {
        return $query->where('eligible_for_airdrops', true)->where('is_active', true);
    }

    /**
     * Get display name (username or shortened wallet address)
     */
    public function getDisplayNameAttribute()
    {
        return $this->username ?: substr($this->wallet_address, 0, 6) . '...' . substr($this->wallet_address, -4);
    }
}
