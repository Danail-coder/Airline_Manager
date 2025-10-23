<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FlightController;

// Flights search (GET) and booking (POST)
Route::get('/flights', [FlightController::class, 'search']);
Route::post('/flights/book', [FlightController::class, 'book']);
