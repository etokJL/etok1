<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

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
                'name' => 'TestUser1',
                'email' => 'user1@test.com',
                'wallet_address' => '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                'password' => bcrypt('password123'),
                'is_active' => true,
                'eligible_for_airdrops' => true,
            ],
            [
                'name' => 'TestUser2',
                'email' => 'user2@test.com',
                'wallet_address' => '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
                'password' => bcrypt('password123'),
                'is_active' => true,
                'eligible_for_airdrops' => true,
            ],
            [
                'name' => 'TestUser3',
                'email' => 'user3@test.com',
                'wallet_address' => '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
                'password' => bcrypt('password123'),
                'is_active' => true,
                'eligible_for_airdrops' => true,
            ],
            [
                'name' => 'TestUser4',
                'email' => 'user4@test.com',
                'wallet_address' => '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
                'password' => bcrypt('password123'),
                'is_active' => true,
                'eligible_for_airdrops' => true,
            ],
            [
                'name' => 'TestUser5',
                'email' => 'user5@test.com',
                'wallet_address' => '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
                'password' => bcrypt('password123'),
                'is_active' => true,
                'eligible_for_airdrops' => true,
            ]
        ];

        foreach ($testUsers as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        echo "✅ Created 5 test users for airdrop testing\n";
    }
}
