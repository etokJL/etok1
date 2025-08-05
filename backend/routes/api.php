<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\AppUser;
use App\Models\AppToken;
use App\Models\Airdrop;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public API routes for frontend integration
Route::prefix('v1')->group(function () {

    // Users API
    Route::get('/users', function () {
        return AppUser::with('tokens')->get();
    });

    Route::get('/users/{address}', function ($address) {
        return AppUser::where('wallet_address', $address)->with('tokens')->first();
    });

    Route::post('/users', function (Request $request) {
        $request->validate([
            'wallet_address' => 'required|string|unique:app_users,wallet_address',
            'email' => 'nullable|email',
            'username' => 'nullable|string'
        ]);

        return AppUser::create($request->all());
    });

    Route::put('/users/{address}', function (Request $request, $address) {
        $user = AppUser::where('wallet_address', $address)->first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->update($request->all());
        return $user;
    });

    // Tokens API
    Route::get('/tokens', function () {
        return AppToken::with('owner')->get();
    });

    Route::get('/tokens/owner/{address}', function ($address) {
        return AppToken::where('owner_address', $address)->get();
    });

    Route::post('/tokens', function (Request $request) {
        $request->validate([
            'contract_address' => 'required|string',
            'token_type' => 'required|in:quest_nft,plant_token',
            'owner_address' => 'required|string'
        ]);

        return AppToken::create($request->all());
    });

    // Airdrops API
    Route::get('/airdrops', function () {
        return Airdrop::orderBy('created_at', 'desc')->get();
    });

    Route::get('/airdrops/active', function () {
        return Airdrop::whereIn('status', ['pending', 'executing'])->get();
    });

    Route::post('/airdrops', function (Request $request) {
        $request->validate([
            'title' => 'required|string',
            'package_id' => 'required|string',
            'nft_types' => 'required|array'
        ]);

        $eligibleUsers = AppUser::eligibleForAirdrops()->count();

        return Airdrop::create([
            'title' => $request->title,
            'package_id' => $request->package_id,
            'nft_types' => $request->nft_types,
            'total_recipients' => $eligibleUsers,
            'scheduled_at' => $request->scheduled_at ?: now()
        ]);
    });

    // Eligible users for airdrops
    Route::get('/users/eligible-for-airdrops', function () {
        return AppUser::eligibleForAirdrops()->get();
    });

    // Statistics
    Route::get('/stats', function () {
        return [
            'total_users' => AppUser::count(),
            'active_users' => AppUser::active()->count(),
            'eligible_users' => AppUser::eligibleForAirdrops()->count(),
            'total_tokens' => AppToken::count(),
            'quest_nfts' => AppToken::questNFTs()->count(),
            'plant_tokens' => AppToken::plantTokens()->count(),
            'pending_airdrops' => Airdrop::pending()->count(),
            'completed_airdrops' => Airdrop::completed()->count()
        ];
    });
});
