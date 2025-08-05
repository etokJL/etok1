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
        Schema::create('airdrops', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // e.g., "Weekly Drop #1"
            $table->string('package_id'); // Smart contract package ID
            $table->json('nft_types'); // Array of NFT types in package
            $table->enum('status', ['pending', 'executing', 'completed', 'failed'])->default('pending');
            $table->integer('total_recipients')->default(0);
            $table->integer('completed_recipients')->default(0);
            $table->string('transaction_hash')->nullable(); // Batch transaction hash
            $table->text('error_message')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('executed_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('scheduled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('airdrops');
    }
};
