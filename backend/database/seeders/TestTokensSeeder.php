<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AppToken;
use App\Models\User;

class TestTokensSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test user
        $testUser = User::firstOrCreate([
            'wallet_address' => '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        ], [
            'name' => 'test_user',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'is_active' => true,
            'eligible_for_airdrops' => true,
        ]);

        // Get the deployed contract addresses
        $questNftAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        $plantTokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

        // Create sample ERC721A NFTs (Quest NFTs) with different types
        $nftTypes = range(1, 15);
        shuffle($nftTypes);

        for ($i = 0; $i < 10; $i++) {
            $nftType = $nftTypes[$i % 15] ?? ($i % 15) + 1;

            AppToken::create([
                'contract_address' => $questNftAddress,
                'token_type' => 'erc721a',
                'token_id' => (string)($i + 1),
                'owner_address' => $testUser->wallet_address,
                'name' => 'Quest NFT #' . ($i + 1),
                'metadata' => [
                    'nft_type' => $nftType,
                    'series' => 'Energy Quest'
                ],
                'transaction_hash' => '0x' . bin2hex(random_bytes(32)),
            ]);
        }

        // Create sample ERC1155 tokens (Plant Tokens)
        for ($i = 0; $i < 3; $i++) {
            AppToken::create([
                'contract_address' => $plantTokenAddress,
                'token_type' => 'erc1155',
                'token_id' => (string)($i + 1),
                'owner_address' => $testUser->wallet_address,
                'name' => 'Plant Token ' . chr(65 + $i), // A, B, C
                'sub_units' => rand(500, 2000),
                'qr_code' => 'PLANT_' . ($i + 1) . '_' . chr(65 + $i),
                'transaction_hash' => '0x' . bin2hex(random_bytes(32)),
            ]);
        }

        $tokenCount = AppToken::where('owner_address', $testUser->wallet_address)->count();

        echo "Created test tokens for demonstration!\n";
        echo "User: {$testUser->wallet_address}\n";
        echo "Quest NFTs: 10\n";
        echo "Plant Tokens: 3\n";
        echo "Total tokens: {$tokenCount}\n";
    }
}
