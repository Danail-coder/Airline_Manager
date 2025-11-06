<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FlightController;

// Serve the main HTML page for all SPA routes
Route::get('/{any}', function () {
    return view('flights'); // Make sure your HTML file is in resources/views/flights.blade.php
})->where('any', '.*');