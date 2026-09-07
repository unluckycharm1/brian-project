<?php

use App\Http\Controllers\StudentController;
use App\Models\Student;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/login')->name('home');
Route::redirect('/signup', '/register')->name('signup');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard', [
            'studentCount' => Student::query()->count(),
            'programCount' => Student::query()->distinct('program')->count('program'),
            'yearLevelCounts' => Student::query()
                ->selectRaw('yr_level, count(*) as total')
                ->groupBy('yr_level')
                ->orderBy('yr_level')
                ->pluck('total', 'yr_level'),
            'recentStudents' => Student::query()->latest()->limit(5)->get(),
        ]);
    })->name('dashboard');

    Route::resource('/students', StudentController::class)->only([
        'index',
        'store',
        'update',
        'destroy',
    ]);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
