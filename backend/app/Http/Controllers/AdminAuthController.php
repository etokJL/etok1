<?php

namespace App\Http\Controllers;

use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    /**
     * Admin login
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $admin = AdminUser::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

        if (!$admin->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Admin account is deactivated',
            ], 403);
        }

        // Update last login
        $admin->updateLastLogin();

        // Create token
        $token = $admin->createToken('admin-token', ['admin'])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'last_login_at' => $admin->last_login_at,
            ],
        ]);
    }

    /**
     * Get authenticated admin user
     */
    public function user(Request $request): JsonResponse
    {
        $admin = $request->user();

        if (!$admin || !$admin instanceof AdminUser) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'last_login_at' => $admin->last_login_at,
            ],
        ]);
    }

    /**
     * Admin logout
     */
    public function logout(Request $request): JsonResponse
    {
        $admin = $request->user();

        if ($admin && $admin instanceof AdminUser) {
            // Revoke current token
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logout successful',
        ]);
    }

    /**
     * Revoke all admin tokens
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $admin = $request->user();

        if ($admin && $admin instanceof AdminUser) {
            // Revoke all tokens
            $admin->tokens()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out from all devices',
        ]);
    }

    /**
     * Create a new admin user (super admin only)
     */
    public function createAdmin(Request $request): JsonResponse
    {
        $currentAdmin = $request->user();

        if (!$currentAdmin instanceof AdminUser || !$currentAdmin->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions. Super admin access required.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admin_users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,super_admin',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $admin = AdminUser::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'is_active' => true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Admin user created successfully',
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'role' => $admin->role,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating admin user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List all admin users (super admin only)
     */
    public function listAdmins(Request $request): JsonResponse
    {
        $currentAdmin = $request->user();

        if (!$currentAdmin instanceof AdminUser || !$currentAdmin->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions. Super admin access required.',
            ], 403);
        }

        $admins = AdminUser::select('id', 'name', 'email', 'role', 'is_active', 'last_login_at', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'admins' => $admins,
        ]);
    }

    /**
     * Update admin status (super admin only)
     */
    public function updateAdminStatus(Request $request, AdminUser $admin): JsonResponse
    {
        $currentAdmin = $request->user();

        if (!$currentAdmin instanceof AdminUser || !$currentAdmin->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions. Super admin access required.',
            ], 403);
        }

        // Prevent deactivating yourself
        if ($admin->id === $currentAdmin->id) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot modify your own account status.',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $admin->update(['is_active' => $request->is_active]);

        // Revoke all tokens if deactivating
        if (!$request->is_active) {
            $admin->tokens()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Admin status updated successfully',
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'is_active' => $admin->is_active,
            ],
        ]);
    }

    /**
     * Get all frontend users (admin only)
     */
    public function getUsers(Request $request): JsonResponse
    {
        $currentAdmin = $request->user();

        if (!$currentAdmin instanceof AdminUser || !$currentAdmin->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions. Admin access required.',
            ], 403);
        }

        $users = User::select('id', 'name', 'email', 'wallet_address', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'users' => $users,
        ]);
    }

    /**
     * Get single frontend user (admin only)
     */
    public function getUser(Request $request, User $user): JsonResponse
    {
        $currentAdmin = $request->user();

        if (!$currentAdmin instanceof AdminUser || !$currentAdmin->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions. Admin access required.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'wallet_address' => $user->wallet_address,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }

    /**
     * Update frontend user (admin only)
     */
    public function updateUser(Request $request, User $user): JsonResponse
    {
        $currentAdmin = $request->user();

        if (!$currentAdmin instanceof AdminUser || !$currentAdmin->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions. Admin access required.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'wallet_address' => 'sometimes|nullable|string|max:255',
            'password' => 'sometimes|nullable|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $updateData = [];

            // Only update fields that were provided
            if ($request->has('name')) {
                $updateData['name'] = $request->name;
            }

            if ($request->has('email')) {
                $updateData['email'] = $request->email;
            }

            if ($request->has('wallet_address')) {
                $updateData['wallet_address'] = $request->wallet_address;
            }

            if ($request->has('password') && !empty($request->password)) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'wallet_address' => $user->wallet_address,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete frontend user (admin only)
     */
    public function deleteUser(Request $request, User $user): JsonResponse
    {
        $currentAdmin = $request->user();

        if (!$currentAdmin instanceof AdminUser || !$currentAdmin->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions. Admin access required.',
            ], 403);
        }

        try {
            // Delete user's tokens first
            $user->tokens()->delete();

            // Delete the user
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create new frontend user (admin only)
     */
    public function createUser(Request $request): JsonResponse
    {
        $currentAdmin = $request->user();

        if (!$currentAdmin instanceof AdminUser || !$currentAdmin->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions. Admin access required.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'wallet_address' => 'nullable|string|max:255',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'wallet_address' => $request->wallet_address,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'wallet_address' => $user->wallet_address,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating user: ' . $e->getMessage(),
            ], 500);
        }
    }
}

