<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        AdminUser::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@booster.com',
            'password' => Hash::make('SuperSecure123!'),
            'role' => 'super_admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create Regular Admin
        AdminUser::create([
            'name' => 'Admin User',
            'email' => 'admin@booster.com',
            'password' => Hash::make('AdminSecure123!'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create Development Admin (easier credentials for dev)
        AdminUser::create([
            'name' => 'Development Admin',
            'email' => 'dev@booster.com',
            'password' => Hash::make('dev123'),
            'role' => 'super_admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $this->command->info('Admin users created successfully!');
        $this->command->info('Super Admin: superadmin@booster.com / SuperSecure123!');
        $this->command->info('Regular Admin: admin@booster.com / AdminSecure123!');
        $this->command->info('Development Admin: dev@booster.com / dev123');
    }
}

