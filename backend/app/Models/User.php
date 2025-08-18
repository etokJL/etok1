<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'wallet_address',
        'email_verified_at',
        'is_active',
        'eligible_for_airdrops',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'eligible_for_airdrops' => 'boolean',
        ];
    }

    /**
     * Get all NFT tokens owned by this user
     */
    public function nftTokens()
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
        return $query->where('eligible_for_airdrops', true)
                    ->where('is_active', true)
                    ->whereNotNull('wallet_address');
    }

    /**
     * Get display name (name or shortened wallet address)
     */
    public function getDisplayNameAttribute()
    {
        return $this->name ?: ($this->wallet_address ? substr($this->wallet_address, 0, 6) . '...' . substr($this->wallet_address, -4) : 'Unknown User');
    }
}
