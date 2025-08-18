<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_address',
        'token_type',
        'token_id',
        'owner_address',
        'name',
        'sub_units',
        'qr_code',
        'transaction_hash',
        'metadata'
    ];

    protected $casts = [
        'sub_units' => 'integer',
        'metadata' => 'array'
    ];

    /**
     * Get the user that owns this token
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_address', 'wallet_address');
    }

    /**
     * Scope for quest NFTs
     */
    public function scopeQuestNFTs($query)
    {
        return $query->where('token_type', 'quest_nft');
    }

    /**
     * Scope for plant tokens
     */
    public function scopePlantTokens($query)
    {
        return $query->where('token_type', 'plant_token');
    }

    /**
     * Get formatted token display name
     */
    public function getDisplayNameAttribute()
    {
        if ($this->token_type === 'plant_token' && $this->name) {
            return $this->name;
        }

        return 'NFT #' . $this->token_id;
    }

    /**
     * Get formatted sub-units display
     */
    public function getFormattedSubUnitsAttribute()
    {
        if ($this->token_type === 'plant_token' && $this->sub_units) {
            return number_format($this->sub_units) . ' units';
        }

        return null;
    }

    /**
     * NFT Types Configuration
     */
    public static function getNftTypesConfig()
    {
        return [
            1 => ['name' => 'e-car', 'image' => 'e-car.png'],
            2 => ['name' => 'e-bike', 'image' => 'e-bike.png'],
            3 => ['name' => 'e-roller', 'image' => 'e-roller.png'],
            4 => ['name' => 'e-scooter', 'image' => 'e-scooter.png'],
            5 => ['name' => 'smart-home', 'image' => 'smart-home.png'],
            6 => ['name' => 'solar-inverter', 'image' => 'solar-inverter.png'],
            7 => ['name' => 'home-battery', 'image' => 'home-battery.png'],
            8 => ['name' => 'smart-meter', 'image' => 'smart-meter.png'],
            9 => ['name' => 'charging-station', 'image' => 'charging-station.png'],
            10 => ['name' => 'heat-pump', 'image' => 'heat-pump.png'],
            11 => ['name' => 'solar-panel', 'image' => 'solar-panel.png'],
            12 => ['name' => 'electric-boiler', 'image' => 'electric-boiler.png'],
            13 => ['name' => 'power-bank', 'image' => 'power-bank.png'],
            14 => ['name' => 'charge-controller', 'image' => 'charge-controller.png'],
            15 => ['name' => 'smartphone', 'image' => 'smartphone.png']
        ];
    }

    /**
     * Get NFT type from metadata
     */
    public function getNftTypeAttribute()
    {
        if ($this->token_type === 'erc721a' && isset($this->metadata['nft_type'])) {
            return (int) $this->metadata['nft_type'];
        }
        return null;
    }

    /**
     * Get NFT type name
     */
    public function getNftTypeNameAttribute()
    {
        $nftType = $this->nft_type;
        if ($nftType) {
            $config = self::getNftTypesConfig();
            return $config[$nftType]['name'] ?? "NFT Type {$nftType}";
        }
        return null;
    }

    /**
     * Get NFT image path
     */
    public function getImagePathAttribute()
    {
        $nftType = $this->nft_type;
        if ($nftType) {
            $config = self::getNftTypesConfig();
            return '/metadata/images/' . ($config[$nftType]['image'] ?? 'default.png');
        }
        return null;
    }

    /**
     * Check if token has image
     */
    public function getHasImageAttribute()
    {
        return $this->token_type === 'erc721a' && $this->nft_type;
    }
}
