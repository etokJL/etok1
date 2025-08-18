<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Admin routes
Route::get('/admin/login', function () {
    return view('admin.login');
})->name('admin.login');

Route::get('/admin', function () {
    return view('admin.dashboard');
})->name('admin.dashboard');

Route::get('/admin/users', function () {
    return view('admin.users');
})->name('admin.users');

Route::get('/admin/tokens', function () {
    return view('admin.tokens');
})->name('admin.tokens');

Route::get('/admin/airdrops', function () {
    return view('admin.airdrops');
})->name('admin.airdrops');
