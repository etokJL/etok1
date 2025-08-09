<?php

namespace App\Http\Controllers;

use App\Models\VisibilityTracking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class VisibilityController extends Controller
{
    /**
     * Mark items as visible
     */
    public function markVisible(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'wallet_address' => 'required|string',
            'items' => 'required|array',
            'items.*.token_id' => 'required|string',
            'items.*.token_type' => 'required|string|in:nft,token'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $walletAddress = $request->wallet_address;
        $items = $request->items;
        $markedVisible = [];

        foreach ($items as $item) {
            $tracking = VisibilityTracking::firstOrCreate(
                [
                    'wallet_address' => $walletAddress,
                    'token_id' => $item['token_id'],
                    'token_type' => $item['token_type']
                ]
            );

            $tracking->markAsVisible();
            $markedVisible[] = [
                'token_id' => $item['token_id'],
                'token_type' => $item['token_type'],
                'was_first_time' => $tracking->wasRecentlyCreated
            ];
        }

        return response()->json([
            'success' => true,
            'marked_visible' => $markedVisible
        ]);
    }

    /**
     * Get pending animations for a user
     */
    public function getPendingAnimations(Request $request, string $walletAddress): JsonResponse
    {
        $mintAnimations = VisibilityTracking::getPendingMintAnimations($walletAddress);
        $burnAnimations = VisibilityTracking::getPendingBurnAnimations($walletAddress);

        return response()->json([
            'success' => true,
            'mint_animations' => $mintAnimations->map(function ($item) {
                return [
                    'token_id' => $item->token_id,
                    'token_type' => $item->token_type,
                    'animation_queue' => $item->animation_queue
                ];
            }),
            'burn_animations' => $burnAnimations->map(function ($item) {
                return [
                    'token_id' => $item->token_id,
                    'token_type' => $item->token_type,
                    'animation_queue' => $item->animation_queue
                ];
            })
        ]);
    }

    /**
     * Clear completed animations
     */
    public function clearAnimations(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'wallet_address' => 'required|string',
            'animations' => 'required|array',
            'animations.*.token_id' => 'required|string',
            'animations.*.token_type' => 'required|string|in:nft,token',
            'animations.*.animation_type' => 'required|string|in:mint,burn'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $walletAddress = $request->wallet_address;
        $animations = $request->animations;
        $cleared = [];

        foreach ($animations as $animation) {
            $tracking = VisibilityTracking::where('wallet_address', $walletAddress)
                ->where('token_id', $animation['token_id'])
                ->where('token_type', $animation['token_type'])
                ->first();

            if ($tracking) {
                if ($animation['animation_type'] === 'mint') {
                    $tracking->clearMintAnimation();
                } elseif ($animation['animation_type'] === 'burn') {
                    $tracking->clearBurnAnimation();
                }

                $cleared[] = [
                    'token_id' => $animation['token_id'],
                    'token_type' => $animation['token_type'],
                    'animation_type' => $animation['animation_type']
                ];
            }
        }

        return response()->json([
            'success' => true,
            'cleared_animations' => $cleared
        ]);
    }

    /**
     * Queue burn animation for token
     */
    public function queueBurnAnimation(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'wallet_address' => 'required|string',
            'token_id' => 'required|string',
            'token_type' => 'required|string|in:nft,token'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $tracking = VisibilityTracking::where('wallet_address', $request->wallet_address)
            ->where('token_id', $request->token_id)
            ->where('token_type', $request->token_type)
            ->first();

        if (!$tracking) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found in visibility tracking'
            ], 404);
        }

        $tracking->queueBurnAnimation();

        return response()->json([
            'success' => true,
            'message' => 'Burn animation queued'
        ]);
    }

    /**
     * Track new minted items
     */
    public function trackNewMint(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'wallet_address' => 'required|string',
            'token_id' => 'required|string',
            'token_type' => 'required|string|in:nft,token'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $tracking = VisibilityTracking::trackItem(
            $request->wallet_address,
            $request->token_id,
            $request->token_type,
            true // isNew = true
        );

        return response()->json([
            'success' => true,
            'message' => 'New mint tracked',
            'needs_animation' => $tracking->needs_mint_animation
        ]);
    }
}
