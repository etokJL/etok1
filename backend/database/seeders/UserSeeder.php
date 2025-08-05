<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AppUser;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users for airdrop testing
        $testUsers = [
            [
                'wallet_address' => '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                'email' => 'user1@test.com',
                'username' => 'TestUser1',
                'is_active' => true,
                'eligible_for_airdrops' => true,
                'metadata' => ['role' => 'test_user']
            ],
            [
                'wallet_address' => '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
                'email' => 'user2@test.com',
                'username' => 'TestUser2',
                'is_active' => true,
                'eligible_for_airdrops' => true,
                'metadata' => ['role' => 'test_user']
            ],
            [
                'wallet_address' => '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
                'email' => 'user3@test.com',
                'username' => 'TestUser3',
                'is_active' => true,
                'eligible_for_airdrops' => true,
                'metadata' => ['role' => 'test_user']
            ],
            [
                'wallet_address' => '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
                'email' => 'user4@test.com',
                'username' => 'TestUser4',
                'is_active' => true,
                'eligible_for_airdrops' => true,
                'metadata' => ['role' => 'test_user']
            ],
            [
                'wallet_address' => '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
                'email' => 'user5@test.com',
                'username' => 'TestUser5',
                'is_active' => true,
                'eligible_for_airdrops' => true,
                'metadata' => ['role' => 'test_user']
            ]
        ];

        foreach ($testUsers as $userData) {
            AppUser::updateOrCreate(
                ['wallet_address' => $userData['wallet_address']],
                $userData
            );
        }

        echo "✅ Created 5 test users for airdrop testing\n";
    }
}
