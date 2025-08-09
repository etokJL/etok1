<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('visibility_tracking', function (Blueprint $table) {
            $table->id();
            $table->string('wallet_address')->index();
            $table->string('token_id');
            $table->string('token_type'); // 'nft' or 'token'
            $table->boolean('has_been_visible')->default(false);
            $table->timestamp('first_visible_at')->nullable();
            $table->timestamp('last_visible_at')->nullable();
            $table->boolean('needs_mint_animation')->default(false);
            $table->boolean('needs_burn_animation')->default(false);
            $table->json('animation_queue')->nullable(); // Queue for pending animations
            $table->timestamps();

            $table->unique(['wallet_address', 'token_id', 'token_type']);
            $table->index(['wallet_address', 'needs_mint_animation']);
            $table->index(['wallet_address', 'needs_burn_animation']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('visibility_tracking');
    }
};
