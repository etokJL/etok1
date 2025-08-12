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
        Schema::table('client_sessions', function (Blueprint $table) {
            $table->timestamp('first_seen_at')->nullable()->change();
            $table->timestamp('last_seen_at')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('client_sessions', function (Blueprint $table) {
            $table->timestamp('first_seen_at')->nullable(false)->change();
            $table->timestamp('last_seen_at')->nullable(false)->change();
        });
    }
};
