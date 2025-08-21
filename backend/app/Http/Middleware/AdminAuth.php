<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
        public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated via default web guard
        if (!Auth::check()) {
            // If it's an AJAX request, return JSON error
            if ($request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Otherwise redirect to login
            return redirect()->route('admin.login')->with('error', 'Please log in to access the admin panel.');
        }

        // Get authenticated user
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('admin.login')->with('error', 'Authentication failed.');
        }

        // Optional: Check if user has admin permissions
        // For now, all authenticated users can access admin (you can add role checks later)

        return $next($request);
    }
}
