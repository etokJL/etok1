<?php

namespace App\Http\Controllers;

use App\Models\ClientSession;
use App\Models\VisibilityTracking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClientSessionController extends Controller
{
    /**
     * Initialisiert oder aktualisiert eine Client Session
     */
    public function initSession(Request $request): JsonResponse
    {
        // Disable output buffering für saubere JSON Antworten
        if (ob_get_level()) {
            ob_clean();
        }

        $validator = Validator::make($request->all(), [
            'session_id' => 'required|string|max:255',
            'wallet_address' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $session = ClientSession::updateOrCreateSession(
            $request->session_id,
            $request->wallet_address,
            $request->userAgent(),
            $request->ip()
        );

        // Synchronisiere mit VisibilityTracking wenn Wallet-Adresse vorhanden
        if ($request->wallet_address) {
            $session->syncWithVisibilityTracking($request->wallet_address);
        }

        return response()->json([
            'success' => true,
            'session' => [
                'session_id' => $session->session_id,
                'wallet_address' => $session->wallet_address,
                'first_seen_at' => $session->first_seen_at,
                'last_seen_at' => $session->last_seen_at,
                'pending_mint_animations' => $session->getPendingMintAnimations(),
                'pending_burn_animations' => $session->getPendingBurnAnimations()
            ]
        ]);
    }

    /**
     * Holt Animation Status für Session
     */
    public function getAnimationStatus(Request $request): JsonResponse
    {
        // Disable output buffering für saubere JSON Antworten
        if (ob_get_level()) {
            ob_clean();
        }

        $validator = Validator::make($request->all(), [
            'session_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $session = ClientSession::where('session_id', $request->session_id)->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'pending_mint_animations' => $session->getPendingMintAnimations(),
            'pending_burn_animations' => $session->getPendingBurnAnimations(),
            'animation_statuses' => $session->nft_animation_statuses ?? []
        ]);
    }

    /**
     * Markiert Mint-Animation als gezeigt
     */
    public function markMintAnimationShown(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'required|string',
            'token_id' => 'required|string',
            'token_type' => 'required|string|in:nft,token'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $session = ClientSession::where('session_id', $request->session_id)->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found'
            ], 404);
        }

        $session->markMintAnimationShown($request->token_id, $request->token_type);

        // Auch im VisibilityTracking markieren wenn Wallet verbunden
        if ($session->wallet_address) {
            $tracking = VisibilityTracking::where('wallet_address', $session->wallet_address)
                ->where('token_id', $request->token_id)
                ->where('token_type', $request->token_type)
                ->first();

            if ($tracking) {
                $tracking->clearMintAnimation();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Mint animation marked as shown'
        ]);
    }

    /**
     * Markiert Burn-Animation als gezeigt
     */
    public function markBurnAnimationShown(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'required|string',
            'token_id' => 'required|string',
            'token_type' => 'required|string|in:nft,token'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $session = ClientSession::where('session_id', $request->session_id)->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found'
            ], 404);
        }

        $session->markBurnAnimationShown($request->token_id, $request->token_type);

        // Auch im VisibilityTracking markieren wenn Wallet verbunden
        if ($session->wallet_address) {
            $tracking = VisibilityTracking::where('wallet_address', $session->wallet_address)
                ->where('token_id', $request->token_id)
                ->where('token_type', $request->token_type)
                ->first();

            if ($tracking) {
                $tracking->clearBurnAnimation();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Burn animation marked as shown'
        ]);
    }

    /**
     * Synchronisiert Session mit VisibilityTracking
     */
    public function syncSession(Request $request): JsonResponse
    {
        // Disable output buffering für saubere JSON Antworten
        if (ob_get_level()) {
            ob_clean();
        }

        $validator = Validator::make($request->all(), [
            'session_id' => 'required|string',
            'wallet_address' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $session = ClientSession::where('session_id', $request->session_id)->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found'
            ], 404);
        }

        // Update Wallet-Adresse
        $session->wallet_address = $request->wallet_address;
        $session->save();

        // Synchronisiere mit VisibilityTracking
        $session->syncWithVisibilityTracking($request->wallet_address);

        return response()->json([
            'success' => true,
            'message' => 'Session synchronized',
            'pending_mint_animations' => $session->getPendingMintAnimations(),
            'pending_burn_animations' => $session->getPendingBurnAnimations()
        ]);
    }

    /**
     * Holt Session Info
     */
    public function getSession(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $session = ClientSession::where('session_id', $request->session_id)->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'session' => [
                'session_id' => $session->session_id,
                'wallet_address' => $session->wallet_address,
                'first_seen_at' => $session->first_seen_at,
                'last_seen_at' => $session->last_seen_at,
                'pending_mint_animations' => $session->getPendingMintAnimations(),
                'pending_burn_animations' => $session->getPendingBurnAnimations(),
                'animation_statuses' => $session->nft_animation_statuses ?? []
            ]
        ]);
    }
}

