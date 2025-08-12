<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('client_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->unique()->index();
            $table->string('wallet_address')->nullable()->index();
            $table->timestamp('first_seen_at')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->json('nft_animation_statuses')->nullable(); // Cache for NFT animation statuses
            $table->string('user_agent')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();

            $table->index(['wallet_address', 'last_seen_at']);
            $table->index(['session_id', 'wallet_address']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('client_sessions');
    }
};

