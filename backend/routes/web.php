<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('welcome');
});

// Public admin login route
Route::get('/admin/login', function () {
    return view('admin.login');
})->name('admin.login');

// Protected admin routes - all require authentication
Route::middleware(['admin.auth'])->prefix('admin')->group(function () {
    Route::get('/', function () {
        return view('admin.dashboard');
    })->name('admin.dashboard');

    Route::get('/users', function () {
        return view('admin.users');
    })->name('admin.users');

    Route::get('/tokens', function () {
        return view('admin.tokens');
    })->name('admin.tokens');

    Route::get('/airdrops', function () {
        return view('admin.airdrops');
    })->name('admin.airdrops');

    // Logout route
    Route::post('/logout', function () {
        auth()->logout();
        session()->flush();
        return redirect()->route('admin.login')->with('success', 'You have been logged out successfully.');
    })->name('admin.logout');
});
