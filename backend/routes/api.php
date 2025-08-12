<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\AppUser;
use App\Models\AppToken;
use App\Models\Airdrop;
use App\Http\Controllers\VisibilityController;
use App\Http\Controllers\ClientSessionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// API v1 routes
Route::prefix('v1')->group(function () {
    // Users
    Route::get('/users', function () {
        return AppUser::all();
    });

    Route::get('/users/eligible-for-airdrops', function () {
        return AppUser::eligibleForAirdrops()->get();
    });

    // Get tokens for a specific user by wallet address
    Route::get('/users/{walletAddress}/tokens', function ($walletAddress) {
        $tokens = AppToken::where('owner_address', $walletAddress)->get();
        return response()->json($tokens);
    });

    // Airdrops
    Route::get('/airdrops', function () {
        return Airdrop::all();
    });

    // Stats
    Route::get('/stats', function () {
        return [
            'total_users' => AppUser::count(),
            'total_tokens' => AppToken::count(),
            'total_airdrops' => Airdrop::count(),
            'erc721a_tokens' => AppToken::where('token_type', 'erc721a')->count(),
            'erc1155_tokens' => AppToken::where('token_type', 'erc1155')->count(),
        ];
    });

    // Client Session Management
    Route::prefix('client-session')->group(function () {
        Route::post('/init', [ClientSessionController::class, 'initSession']);
        Route::post('/sync', [ClientSessionController::class, 'syncSession']);
        Route::get('/status', [ClientSessionController::class, 'getAnimationStatus']);
        Route::get('/{sessionId}', [ClientSessionController::class, 'getSession']);
        Route::post('/animation/mint/shown', [ClientSessionController::class, 'markMintAnimationShown']);
        Route::post('/animation/burn/shown', [ClientSessionController::class, 'markBurnAnimationShown']);
    });
});
