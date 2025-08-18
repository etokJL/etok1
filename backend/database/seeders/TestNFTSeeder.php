<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AppToken;
use App\Models\User;

class TestNFTSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test user if not exists
        $testUser = User::firstOrCreate([
            'wallet_address' => '0x742d35Cc6634C0532925a3b8D7c9d24E5c55A4e1'
        ], [
            'name' => 'Test User',
            'email' => 'test@example.com'
        ]);

        // Sample NFT data with proper names for image mapping
        $nftData = [
            ['name' => 'Solar Panel', 'token_type' => 'erc721a'],
            ['name' => 'Home battery', 'token_type' => 'erc721a'],
            ['name' => 'Smart home', 'token_type' => 'erc721a'],
            ['name' => 'E-Car', 'token_type' => 'erc721a'],
            ['name' => 'Smart meter', 'token_type' => 'erc721a'],
            ['name' => 'Heat pump', 'token_type' => 'erc721a'],
            ['name' => 'E-Bike', 'token_type' => 'erc721a'],
            ['name' => 'Smartphone', 'token_type' => 'erc721a'],
            ['name' => 'Power bank', 'token_type' => 'erc721a'],
            ['name' => 'Charging station', 'token_type' => 'erc721a'],
            ['name' => 'E-Scooter', 'token_type' => 'erc721a'],
            ['name' => 'E-Roller', 'token_type' => 'erc721a'],
            ['name' => 'Electric boiler', 'token_type' => 'erc721a'],
            ['name' => 'Charge controller', 'token_type' => 'erc721a'],
            ['name' => 'Solar inverter', 'token_type' => 'erc721a'],
        ];

        // Clear existing test tokens
        AppToken::where('owner_address', $testUser->wallet_address)->delete();

        // Create test tokens
        foreach ($nftData as $index => $nft) {
            AppToken::create([
                'token_id' => 'test_' . ($index + 1),
                'owner_address' => $testUser->wallet_address,
                'name' => $nft['name'],
                'token_type' => $nft['token_type'],
                'metadata' => json_encode([
                    'name' => $nft['name'],
                    'description' => "A Swiss-quality {$nft['name']} NFT from the Energy Collection",
                    'image' => "metadata/images/" . $this->getImageFileName($nft['name']),
                    'attributes' => [
                        ['trait_type' => 'Quality', 'value' => 'Swiss'],
                        ['trait_type' => 'Rarity', 'value' => 'Rare'],
                        ['trait_type' => 'Energy Type', 'value' => $this->getEnergyType($nft['name'])]
                    ]
                ])
            ]);
        }

        $this->command->info('Created ' . count($nftData) . ' test NFTs for user ' . $testUser->wallet_address);
    }

    /**
     * Get image filename based on NFT name
     */
    private function getImageFileName(string $name): string
    {
        $mapping = [
            'Solar Panel' => 'solar-panel.png',
            'Home battery' => 'home-battery.png',
            'Smart home' => 'smart-home.png',
            'E-Car' => 'e-car.png',
            'Smart meter' => 'smart-meter.png',
            'Heat pump' => 'heat-pump.png',
            'E-Bike' => 'e-bike.png',
            'Smartphone' => 'smartphone.png',
            'Power bank' => 'power-bank.png',
            'Charging station' => 'charging-station.png',
            'E-Scooter' => 'e-scooter.png',
            'E-Roller' => 'e-roller.png',
            'Electric boiler' => 'electric-boiler.png',
            'Charge controller' => 'charge-controller.png',
            'Solar inverter' => 'solar-inverter.png',
        ];

        return $mapping[$name] ?? 'solar-panel.png';
    }

    /**
     * Get energy type based on NFT name
     */
    private function getEnergyType(string $name): string
    {
        if (str_contains(strtolower($name), 'solar')) return 'Solar';
        if (str_contains(strtolower($name), 'battery') || str_contains(strtolower($name), 'storage')) return 'Storage';
        if (str_contains(strtolower($name), 'smart') || str_contains(strtolower($name), 'meter')) return 'Smart';
        if (str_contains(strtolower($name), 'car') || str_contains(strtolower($name), 'bike') || str_contains(strtolower($name), 'scooter') || str_contains(strtolower($name), 'roller')) return 'Transport';
        if (str_contains(strtolower($name), 'heat') || str_contains(strtolower($name), 'boiler')) return 'Storage';
        if (str_contains(strtolower($name), 'charging') || str_contains(strtolower($name), 'controller') || str_contains(strtolower($name), 'inverter')) return 'Smart';

        return 'Solar';
    }
}
