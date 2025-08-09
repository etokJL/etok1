<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class VisibilityTracking extends Model
{
    use HasFactory;

    protected $table = 'visibility_tracking';

    protected $fillable = [
        'wallet_address',
        'token_id',
        'token_type',
        'has_been_visible',
        'first_visible_at',
        'last_visible_at',
        'needs_mint_animation',
        'needs_burn_animation',
        'animation_queue'
    ];

    protected $casts = [
        'has_been_visible' => 'boolean',
        'needs_mint_animation' => 'boolean',
        'needs_burn_animation' => 'boolean',
        'first_visible_at' => 'datetime',
        'last_visible_at' => 'datetime',
        'animation_queue' => 'array'
    ];

    /**
     * Mark an item as visible and update timestamps
     */
    public function markAsVisible(): void
    {
        $now = Carbon::now();

        if (!$this->has_been_visible) {
            $this->first_visible_at = $now;
            $this->has_been_visible = true;
        }

        $this->last_visible_at = $now;
        $this->save();
    }

    /**
     * Queue a mint animation for this item
     */
    public function queueMintAnimation(): void
    {
        $this->needs_mint_animation = true;
        $this->addToAnimationQueue('mint', ['queued_at' => Carbon::now()]);
        $this->save();
    }

    /**
     * Queue a burn animation for this item
     */
    public function queueBurnAnimation(): void
    {
        $this->needs_burn_animation = true;
        $this->addToAnimationQueue('burn', ['queued_at' => Carbon::now()]);
        $this->save();
    }

    /**
     * Clear mint animation flag
     */
    public function clearMintAnimation(): void
    {
        $this->needs_mint_animation = false;
        $this->removeFromAnimationQueue('mint');
        $this->save();
    }

    /**
     * Clear burn animation flag
     */
    public function clearBurnAnimation(): void
    {
        $this->needs_burn_animation = false;
        $this->removeFromAnimationQueue('burn');
        $this->save();
    }

    /**
     * Add animation to queue
     */
    private function addToAnimationQueue(string $type, array $data): void
    {
        $queue = $this->animation_queue ?? [];
        $queue[$type] = $data;
        $this->animation_queue = $queue;
    }

    /**
     * Remove animation from queue
     */
    private function removeFromAnimationQueue(string $type): void
    {
        $queue = $this->animation_queue ?? [];
        unset($queue[$type]);
        $this->animation_queue = empty($queue) ? null : $queue;
    }

    /**
     * Get items that need mint animations for a user
     */
    public static function getPendingMintAnimations(string $walletAddress): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('wallet_address', $walletAddress)
            ->where('needs_mint_animation', true)
            ->get();
    }

    /**
     * Get items that need burn animations for a user
     */
    public static function getPendingBurnAnimations(string $walletAddress): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('wallet_address', $walletAddress)
            ->where('needs_burn_animation', true)
            ->get();
    }

    /**
     * Create or update visibility tracking for an item
     */
    public static function trackItem(string $walletAddress, string $tokenId, string $tokenType, bool $isNew = false): self
    {
        $tracking = static::firstOrCreate(
            [
                'wallet_address' => $walletAddress,
                'token_id' => $tokenId,
                'token_type' => $tokenType
            ],
            [
                'has_been_visible' => false,
                'needs_mint_animation' => $isNew
            ]
        );

        if ($isNew && !$tracking->has_been_visible) {
            $tracking->queueMintAnimation();
        }

        return $tracking;
    }
}
