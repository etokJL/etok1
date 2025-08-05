<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AppToken;
use App\Models\AppUser;

class RealTokensSeeder extends Seeder
{
    public function run()
    {
        $userAddress = '0xd72EF037375c455Ca30ab03D5C97173b0c06719E';
        $questNFTAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';
        $plantTokenAddress = '0x0165878A594ca255338adfa4d48449f69242Eb8F';

        // Clear existing tokens for this user
        AppToken::where('owner_address', $userAddress)->delete();

        // Ensure user exists
        $user = AppUser::firstOrCreate([
            'wallet_address' => $userAddress
        ], [
            'name' => 'Test User Real',
            'email' => 'real@test.com'
        ]);

        echo "Creating real tokens from blockchain data...\n";

        // Real NFT data from blockchain: 15 tokens with specific types
        $realNFTData = [
            ['token_id' => 1, 'nft_type' => 1],   // e-car
            ['token_id' => 2, 'nft_type' => 5],   // smart-home
            ['token_id' => 3, 'nft_type' => 14],  // charge-controller
            ['token_id' => 4, 'nft_type' => 1],   // e-car
            ['token_id' => 5, 'nft_type' => 13],  // power-bank
            ['token_id' => 6, 'nft_type' => 9],   // charging-station
            ['token_id' => 7, 'nft_type' => 7],   // home-battery
            ['token_id' => 8, 'nft_type' => 15],  // smartphone
            ['token_id' => 9, 'nft_type' => 8],   // smart-meter
            ['token_id' => 10, 'nft_type' => 13], // power-bank
            ['token_id' => 11, 'nft_type' => 9],  // charging-station
            ['token_id' => 12, 'nft_type' => 3],  // e-roller
            ['token_id' => 13, 'nft_type' => 12], // electric-boiler
            ['token_id' => 14, 'nft_type' => 12], // electric-boiler
            ['token_id' => 15, 'nft_type' => 7],  // home-battery
        ];

        $nftTypesConfig = AppToken::getNftTypesConfig();

        foreach ($realNFTData as $nftData) {
            $config = $nftTypesConfig[$nftData['nft_type']];

            AppToken::create([
                'contract_address' => $questNFTAddress,
                'token_type' => 'erc721a',
                'token_id' => (string) $nftData['token_id'],
                'owner_address' => $userAddress,
                'name' => ucfirst(str_replace('-', ' ', $config['name'])),
                'metadata' => [
                    'nft_type' => $nftData['nft_type'],
                    'series' => 'Energy Quest'
                ],
                'transaction_hash' => '0x' . bin2hex(random_bytes(32)),
            ]);
        }

        // Add a few plant tokens for demonstration
        for ($i = 0; $i < 2; $i++) {
            AppToken::create([
                'contract_address' => $plantTokenAddress,
                'token_type' => 'erc1155',
                'token_id' => (string)($i + 1),
                'owner_address' => $userAddress,
                'name' => 'Plant Token ' . chr(65 + $i), // A, B
                'sub_units' => rand(500, 2000),
                'qr_code' => 'PLANT_' . ($i + 1) . '_' . chr(65 + $i),
                'transaction_hash' => '0x' . bin2hex(random_bytes(32)),
            ]);
        }

        $totalTokens = AppToken::where('owner_address', $userAddress)->count();

        echo "✅ Created real tokens for user: {$userAddress}\n";
        echo "📊 Quest NFTs: 15 (with real types and images)\n";
        echo "🌱 Plant Tokens: 2\n";
        echo "🎯 Total tokens: {$totalTokens}\n";
    }
}
