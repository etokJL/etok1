<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /**
     * Send password reset link via email
     */
    public function sendResetLink(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Delete existing tokens for this email
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Create new token
        $token = Str::random(64);
        
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now()
        ]);

        // Send email (simplified for demo - in production use Mail facade with proper templates)
        $resetUrl = config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($request->email);
        
        // For demo purposes, we'll return the reset URL
        // In production, you'd send this via email
        return response()->json([
            'success' => true,
            'message' => 'Password reset link sent successfully',
            'data' => [
                'reset_url' => $resetUrl, // Remove this in production
                'token' => $token // Remove this in production
            ]
        ]);
    }

    /**
     * Reset password using token
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find the token
        $passwordReset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$passwordReset) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token'
            ], 400);
        }

        // Check if token is valid (within 60 minutes)
        if (Carbon::parse($passwordReset->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'success' => false,
                'message' => 'Token has expired'
            ], 400);
        }

        // Verify token
        if (!Hash::check($request->token, $passwordReset->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token'
            ], 400);
        }

        // Update user password
        $user = User::where('email', $request->email)->first();
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Delete the token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully'
        ]);
    }

    /**
     * Verify reset token
     */
    public function verifyToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $passwordReset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$passwordReset) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token'
            ], 400);
        }

        // Check if token is expired
        if (Carbon::parse($passwordReset->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'success' => false,
                'message' => 'Token has expired'
            ], 400);
        }

        // Verify token
        if (!Hash::check($request->token, $passwordReset->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Token is valid'
        ]);
    }
}