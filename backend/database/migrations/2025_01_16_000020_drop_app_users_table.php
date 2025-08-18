<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the app_users table as we're now using the users table for everything
        Schema::dropIfExists('app_users');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate the app_users table if needed
        Schema::create('app_users', function (Blueprint $table) {
            $table->id();
            $table->string('wallet_address')->unique();
            $table->string('email')->nullable();
            $table->string('username')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('eligible_for_airdrops')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('wallet_address');
            $table->index('is_active');
            $table->index('eligible_for_airdrops');
        });
    }
};


