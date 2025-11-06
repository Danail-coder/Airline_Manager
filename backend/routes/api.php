<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FlightController;

// API Routes - automatically prefixed with /api
Route::get('/flights', [FlightController::class, 'search']);
Route::post('/flights/book', [FlightController::class, 'book']);
Route::get('/results', [FlightController::class, 'results']);