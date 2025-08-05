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
        Schema::create('app_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('contract_address');
            $table->string('token_type'); // 'quest_nft' or 'plant_token'
            $table->string('token_id')->nullable(); // For ERC721/1155 token ID
            $table->string('owner_address');
            $table->string('name')->nullable(); // Plant token name
            $table->integer('sub_units')->nullable(); // For plant tokens
            $table->string('qr_code')->nullable(); // Plant token QR code
            $table->string('transaction_hash')->nullable(); // Minting transaction
            $table->json('metadata')->nullable(); // Additional token data
            $table->timestamps();

            $table->index(['contract_address', 'token_type']);
            $table->index('owner_address');
            $table->index('token_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_tokens');
    }
};
