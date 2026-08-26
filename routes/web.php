<?php

use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. Changed URL to '/signup' and name to 'signup'
Route::inertia('/signup', 'signup')->name('signup');

// 2. Kept as the root URL '/'
Route::get('/', function () {
    return Inertia::render('Auth/login');
})->name('home'); // It's best practice to name your login route 'login' so the auth middleware knows where to redirect unauthenticated users.


Route::apiResource('/students', StudentController::class);

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';