<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ClockController;

Route::get('/', [ClockController::class, 'index']);
Route::get('/clocks/manage', [ClockController::class, 'manage'])->name('clocks.manage');
Route::get('/clocks/{nuc}/edit', [ClockController::class, 'edit'])->name('clocks.edit');
Route::post('/clocks/{nuc}/update', [ClockController::class, 'update'])->name('clocks.update');

