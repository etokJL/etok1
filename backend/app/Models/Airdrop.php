<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Airdrop extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'package_id',
        'nft_types',
        'status',
        'total_recipients',
        'completed_recipients',
        'transaction_hash',
        'error_message',
        'scheduled_at',
        'executed_at'
    ];

    protected $casts = [
        'nft_types' => 'array',
        'total_recipients' => 'integer',
        'completed_recipients' => 'integer',
        'scheduled_at' => 'datetime',
        'executed_at' => 'datetime'
    ];

    /**
     * Scope for pending airdrops
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for completed airdrops
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Get progress percentage
     */
    public function getProgressPercentageAttribute()
    {
        if ($this->total_recipients === 0) {
            return 0;
        }

        return round(($this->completed_recipients / $this->total_recipients) * 100, 2);
    }

    /**
     * Get formatted NFT types display
     */
    public function getFormattedNftTypesAttribute()
    {
        if (!$this->nft_types) {
            return 'No NFTs';
        }

        return 'NFTs: ' . implode(', ', $this->nft_types);
    }

    /**
     * Check if airdrop is in progress
     */
    public function isInProgress()
    {
        return $this->status === 'executing';
    }

    /**
     * Check if airdrop can be executed
     */
    public function canExecute()
    {
        return $this->status === 'pending';
    }
}
