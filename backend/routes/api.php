<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FlightController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Flights search (GET) and booking (POST)
Route::get('/flights', [FlightController::class, 'search']);
Route::post('/flights/book', [FlightController::class, 'book']);

// Optional: Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is running',
        'timestamp' => now()->toISOString()
    ]);
});