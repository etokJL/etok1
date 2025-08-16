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
        Schema::table('users', function (Blueprint $table) {
            $table->string('wallet_address')->nullable()->unique()->after('email');
            $table->boolean('is_active')->default(true)->after('wallet_address');
            $table->boolean('eligible_for_airdrops')->default(false)->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['wallet_address', 'is_active', 'eligible_for_airdrops']);
        });
    }
};