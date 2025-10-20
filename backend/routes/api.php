<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/flights', function (Request $request) {
    return response()->json([
        ['id' => 'FL001', 'airline' => 'Airline A', 'depart' => '10:00', 'arrive' => '12:30', 'duration' => '2h 30m', 'price' => 150],
        ['id' => 'FL002', 'airline' => 'Airline B', 'depart' => '11:15', 'arrive' => '14:00', 'duration' => '2h 45m', 'price' => 180],
        ['id' => 'FL003', 'airline' => 'Airline C', 'depart' => '13:30', 'arrive' => '16:00', 'duration' => '2h 30m', 'price' => 200],
    ]);
});
