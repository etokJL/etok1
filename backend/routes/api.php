<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\AppToken;
use App\Models\Airdrop;
use App\Http\Controllers\VisibilityController;
use App\Http\Controllers\ClientSessionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\ContractController;

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

// Frontend User Authentication routes (public)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Password reset routes
    Route::post('/password/reset/send', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);
    Route::post('/password/reset/verify', [PasswordResetController::class, 'verifyToken']);

    // Protected auth routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });
});

// Admin Authentication routes (separate from frontend users)
Route::prefix('admin/auth')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [AdminAuthController::class, 'user']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::post('/logout-all', [AdminAuthController::class, 'logoutAll']);
        Route::post('/create-admin', [AdminAuthController::class, 'createAdmin']);
        Route::get('/admins', [AdminAuthController::class, 'listAdmins']);
        Route::patch('/admins/{admin}/status', [AdminAuthController::class, 'updateAdminStatus']);
    });
});

// Admin User Management routes (for managing frontend users)
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/frontend-users', [AdminAuthController::class, 'getUsers']);
    Route::get('/frontend-users/{user}', [AdminAuthController::class, 'getUser']);
    Route::put('/frontend-users/{user}', [AdminAuthController::class, 'updateUser']);
    Route::delete('/frontend-users/{user}', [AdminAuthController::class, 'deleteUser']);
    Route::post('/frontend-users', [AdminAuthController::class, 'createUser']);
});

// Broadcasting auth endpoint (for WebSocket authentication)
Route::middleware('auth:sanctum')->post('/broadcasting/auth', function (Request $request) {
    // For public channels, always return success
    return response()->json(['auth' => true]);
});

// Contract Management routes (public for development)
Route::prefix('contracts')->group(function () {
    Route::get('/', [ContractController::class, 'getContracts']);
    Route::get('/check', [ContractController::class, 'checkDeployment']);
    Route::post('/reload', [ContractController::class, 'reloadContracts']);
});

// Chat routes (mixed access)
Route::prefix('chat')->group(function () {
    // Public routes - anyone can read messages and see users
    Route::get('/messages', [ChatController::class, 'getMessages']);
    Route::get('/users', [ChatController::class, 'getOnlineUsers']);

    // Protected routes - only authenticated users can send messages
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/messages', [ChatController::class, 'sendMessage']);
    });
});

// User management routes (protected)
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::get('/stats', [UserController::class, 'stats']);
});

// API v1 routes
Route::prefix('v1')->group(function () {
    // Users
    Route::get('/users', function () {
        return User::active()->get(['id', 'name', 'email', 'wallet_address', 'is_active', 'eligible_for_airdrops', 'created_at']);
    });

    Route::get('/users/eligible-for-airdrops', function () {
        return User::eligibleForAirdrops()->get(['id', 'name', 'email', 'wallet_address', 'is_active', 'eligible_for_airdrops', 'created_at']);
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
            'total_users' => User::count(),
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
