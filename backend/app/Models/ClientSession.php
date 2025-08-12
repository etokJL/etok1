<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ClientSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'wallet_address',
        'first_seen_at',
        'last_seen_at',
        'nft_animation_statuses',
        'user_agent',
        'ip_address'
    ];

    protected $casts = [
        'first_seen_at' => 'datetime',
        'last_seen_at' => 'datetime',
        'nft_animation_statuses' => 'array'
    ];

    /**
     * Erstellt oder aktualisiert eine Client Session
     */
    public static function updateOrCreateSession(
        string $sessionId,
        ?string $walletAddress = null,
        ?string $userAgent = null,
        ?string $ipAddress = null
    ): self {
        $now = Carbon::now();

        $session = static::firstOrNew(['session_id' => $sessionId]);

        $session->wallet_address = $walletAddress;
        $session->last_seen_at = $now;
        $session->user_agent = $userAgent;
        $session->ip_address = $ipAddress;

        // Nur first_seen_at setzen wenn es noch nicht existiert
        if (!$session->first_seen_at) {
            $session->first_seen_at = $now;
        }

        $session->save();

        return $session;
    }

    /**
     * Holt NFT Animation Status für diese Session
     */
    public function getNftAnimationStatus(string $tokenId, string $tokenType): ?array
    {
        $statuses = $this->nft_animation_statuses ?? [];
        $key = "{$tokenType}_{$tokenId}";

        return $statuses[$key] ?? null;
    }

    /**
     * Setzt NFT Animation Status für diese Session
     */
    public function setNftAnimationStatus(string $tokenId, string $tokenType, array $status): void
    {
        $statuses = $this->nft_animation_statuses ?? [];
        $key = "{$tokenType}_{$tokenId}";

        $statuses[$key] = array_merge($status, [
            'updated_at' => Carbon::now()->toISOString()
        ]);

        $this->nft_animation_statuses = $statuses;
        $this->save();
    }

    /**
     * Markiert Mint-Animation als gezeigt
     */
    public function markMintAnimationShown(string $tokenId, string $tokenType): void
    {
        $status = $this->getNftAnimationStatus($tokenId, $tokenType) ?? [
            'needs_mint_animation' => false,
            'needs_burn_animation' => false
        ];

        $status['needs_mint_animation'] = false;
        $status['last_mint_animation_shown'] = Carbon::now()->toISOString();

        $this->setNftAnimationStatus($tokenId, $tokenType, $status);
    }

    /**
     * Markiert Burn-Animation als gezeigt
     */
    public function markBurnAnimationShown(string $tokenId, string $tokenType): void
    {
        $status = $this->getNftAnimationStatus($tokenId, $tokenType) ?? [
            'needs_mint_animation' => false,
            'needs_burn_animation' => false
        ];

        $status['needs_burn_animation'] = false;
        $status['last_burn_animation_shown'] = Carbon::now()->toISOString();

        $this->setNftAnimationStatus($tokenId, $tokenType, $status);
    }

    /**
     * Holt alle NFTs die Mint-Animationen brauchen
     */
    public function getPendingMintAnimations(): array
    {
        $statuses = $this->nft_animation_statuses ?? [];
        $pending = [];

        foreach ($statuses as $key => $status) {
            if ($status['needs_mint_animation'] ?? false) {
                [$tokenType, $tokenId] = explode('_', $key, 2);
                $pending[] = [
                    'token_id' => $tokenId,
                    'token_type' => $tokenType,
                    'status' => $status
                ];
            }
        }

        return $pending;
    }

    /**
     * Holt alle NFTs die Burn-Animationen brauchen
     */
    public function getPendingBurnAnimations(): array
    {
        $statuses = $this->nft_animation_statuses ?? [];
        $pending = [];

        foreach ($statuses as $key => $status) {
            if ($status['needs_burn_animation'] ?? false) {
                [$tokenType, $tokenId] = explode('_', $key, 2);
                $pending[] = [
                    'token_id' => $tokenId,
                    'token_type' => $tokenType,
                    'status' => $status
                ];
            }
        }

        return $pending;
    }

    /**
     * Synchronisiert Animation Status mit VisibilityTracking
     */
    public function syncWithVisibilityTracking(?string $walletAddress = null): void
    {
        $address = $walletAddress ?? $this->wallet_address;
        if (!$address) return;

        // Holt alle Visibility Tracking Records für diese Wallet
        $trackingRecords = VisibilityTracking::where('wallet_address', $address)->get();

        $statuses = $this->nft_animation_statuses ?? [];

        foreach ($trackingRecords as $tracking) {
            $key = "{$tracking->token_type}_{$tracking->token_id}";

            // Update oder erstelle Status basierend auf Visibility Tracking
            $statuses[$key] = [
                'needs_mint_animation' => $tracking->needs_mint_animation,
                'needs_burn_animation' => $tracking->needs_burn_animation,
                'has_been_visible' => $tracking->has_been_visible,
                'first_visible_at' => $tracking->first_visible_at?->toISOString(),
                'last_visible_at' => $tracking->last_visible_at?->toISOString(),
                'synced_at' => Carbon::now()->toISOString()
            ];
        }

        $this->nft_animation_statuses = $statuses;
        $this->save();
    }

    /**
     * Bereinigt alte Sessions (älter als 30 Tage ohne Aktivität)
     */
    public static function cleanupOldSessions(): int
    {
        $cutoff = Carbon::now()->subDays(30);

        return static::where('last_seen_at', '<', $cutoff)->delete();
    }
}

