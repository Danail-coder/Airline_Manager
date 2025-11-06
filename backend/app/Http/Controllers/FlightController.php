<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FlightController extends Controller
{
    public function search(Request $request)
    {
        // You could eventually fetch data from a database or API
        $flights = [
            ['id' => 'FL001', 'airline' => 'Airline A', 'depart' => '10:00', 'arrive' => '12:30', 'duration' => '2h 30m', 'price' => 150],
            ['id' => 'FL002', 'airline' => 'Airline B', 'depart' => '11:15', 'arrive' => '14:00', 'duration' => '2h 45m', 'price' => 180],
            ['id' => 'FL003', 'airline' => 'Airline C', 'depart' => '13:30', 'arrive' => '16:00', 'duration' => '2h 30m', 'price' => 200],
        ];

        return response()->json($flights);
    }

    public function book(Request $request)
    {
        $validated = $request->validate([
            'flight.id' => 'required',
            'flight.airline' => 'required',
            'passenger.name' => 'required|string|max:255',
            'passenger.email' => 'required|email',
            'passenger.phone' => 'nullable|string|max:20',
        ]);

        // Simulated booking confirmation
        $booking = [
            'bookingReference' => 'REF' . strtoupper(uniqid()),
            'ticketNumber' => 'TKT' . rand(100000, 999999),
            'status' => 'Confirmed',
            'flight' => $validated['flight'],
            'passenger' => $validated['passenger'],
        ];

        return response()->json($booking);
    }

    public function results(Request $request)
    {
        // Return flight search results
        // You can accept query parameters like origin, destination, date, etc.
        $origin = $request->query('origin');
        $destination = $request->query('destination');
        $date = $request->query('date');

        $flights = [
            ['id' => 'FL001', 'airline' => 'Airline A', 'origin' => $origin, 'destination' => $destination, 'depart' => '10:00', 'arrive' => '12:30', 'duration' => '2h 30m', 'price' => 150],
            ['id' => 'FL002', 'airline' => 'Airline B', 'origin' => $origin, 'destination' => $destination, 'depart' => '11:15', 'arrive' => '14:00', 'duration' => '2h 45m', 'price' => 180],
            ['id' => 'FL003', 'airline' => 'Airline C', 'origin' => $origin, 'destination' => $destination, 'depart' => '13:30', 'arrive' => '16:00', 'duration' => '2h 30m', 'price' => 200],
        ];

        return response()->json([
            'searchParams' => [
                'origin' => $origin,
                'destination' => $destination,
                'date' => $date,
            ],
            'flights' => $flights,
        ]);
    }
}