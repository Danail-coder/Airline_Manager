// results.js
document.addEventListener('DOMContentLoaded', () => {
  const resultsContainer = document.getElementById('results-container');

  // Get search criteria from localStorage
  const searchCriteria = JSON.parse(localStorage.getItem('flightSearchCriteria'));

  if (!searchCriteria) {
    // If no search criteria, redirect back to search
    alert('No search criteria found. Please search for flights first.');
    window.location.href = 'search.html';
    return;
  }

  // Sample flight data (in a real app, this would come from an API)
  const allFlights = [
    {
      id: 'FL001',
      from: 'Accra',
      fromCode: 'ACC',
      to: 'London',
      toCode: 'LHR',
      departureTime: '10:30 AM',
      arrivalTime: '10:45 PM',
      duration: '7h 15m',
      stops: 'Direct',
      price: 450,
      airline: 'SkyWings Airways',
      flightNumber: 'SW-101',
      aircraft: 'Boeing 787',
      class: 'Economy'
    },
    {
      id: 'FL002',
      from: 'Accra',
      fromCode: 'ACC',
      to: 'London',
      toCode: 'LHR',
      departureTime: '2:15 PM',
      arrivalTime: '4:30 AM +1',
      duration: '7h 15m',
      stops: 'Direct',
      price: 620,
      airline: 'SkyWings Airways',
      flightNumber: 'SW-102',
      aircraft: 'Airbus A350',
      class: 'Business'
    },
    {
      id: 'FL003',
      from: 'New York',
      fromCode: 'JFK',
      to: 'Paris',
      toCode: 'CDG',
      departureTime: '8:00 AM',
      arrivalTime: '9:45 PM',
      duration: '8h 45m',
      stops: 'Direct',
      price: 550,
      airline: 'SkyWings Airways',
      flightNumber: 'SW-201',
      aircraft: 'Boeing 777',
      class: 'Economy'
    },
    {
      id: 'FL004',
      from: 'London',
      fromCode: 'LHR',
      to: 'Dubai',
      toCode: 'DXB',
      departureTime: '11:00 AM',
      arrivalTime: '9:30 PM',
      duration: '6h 30m',
      stops: 'Direct',
      price: 680,
      airline: 'SkyWings Airways',
      flightNumber: 'SW-301',
      aircraft: 'Airbus A380',
      class: 'Business'
    },
    {
      id: 'FL005',
      from: 'Lagos',
      fromCode: 'LOS',
      to: 'Johannesburg',
      toCode: 'JNB',
      departureTime: '6:45 AM',
      arrivalTime: '1:15 PM',
      duration: '5h 30m',
      stops: 'Direct',
      price: 380,
      airline: 'SkyWings Airways',
      flightNumber: 'SW-401',
      aircraft: 'Boeing 737',
      class: 'Economy'
    }
  ];

  // Filter flights based on search criteria
  const filteredFlights = allFlights.filter(flight => {
    const fromMatch = flight.from.toLowerCase().includes(searchCriteria.from.toLowerCase()) ||
                      flight.fromCode.toLowerCase().includes(searchCriteria.from.toLowerCase());
    const toMatch = flight.to.toLowerCase().includes(searchCriteria.to.toLowerCase()) ||
                    flight.toCode.toLowerCase().includes(searchCriteria.to.toLowerCase());
    return fromMatch && toMatch;
  });

  // Display flights
  if (filteredFlights.length === 0) {
    resultsContainer.innerHTML = `
      <div class="text-center py-8">
        <p class="text-gray-600 text-lg mb-4">No flights found for your search criteria.</p>
        <p class="text-gray-500 mb-6">
          <strong>From:</strong> ${searchCriteria.from} | 
          <strong>To:</strong> ${searchCriteria.to} | 
          <strong>Date:</strong> ${searchCriteria.date} | 
          <strong>Class:</strong> ${searchCriteria.class}
        </p>
        <a href="search.html" class="inline-block bg-[var(--sky-blue)] text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold">
          Try Another Search
        </a>
      </div>
    `;
    return;
  }

  // Clear existing content
  resultsContainer.innerHTML = '';

  // Display search criteria
  const searchInfo = document.createElement('div');
  searchInfo.className = 'bg-blue-50 p-4 rounded-lg mb-6 text-sm';
  searchInfo.innerHTML = `
    <p class="text-gray-700">
      <strong>Search Results:</strong> ${searchCriteria.from} → ${searchCriteria.to} | 
      ${searchCriteria.date} | ${searchCriteria.class} Class | 
      <strong>${filteredFlights.length}</strong> flight(s) found
    </p>
  `;
  resultsContainer.appendChild(searchInfo);

  // Create flight cards
  filteredFlights.forEach(flight => {
    const flightCard = document.createElement('div');
    flightCard.className = 'flight-card';
    flightCard.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-800">
            ${flight.from} (${flight.fromCode}) → ${flight.to} (${flight.toCode})
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            <strong>${flight.airline}</strong> | Flight ${flight.flightNumber} | ${flight.aircraft}
          </p>
          <p class="text-sm text-gray-600 mt-1">
            Departure: ${flight.departureTime} | Arrival: ${flight.arrivalTime}
          </p>
          <p class="text-sm text-gray-600">
            Duration: ${flight.duration} | Stops: ${flight.stops}
          </p>
          <p class="text-xs text-gray-500 mt-1">
            Class: ${flight.class}
          </p>
        </div>
        <div class="text-right sm:text-center">
          <p class="text-2xl font-bold text-[var(--sky-blue)]">$${flight.price}</p>
          <button 
            class="mt-2 bg-[var(--sky-blue)] text-white rounded-lg font-semibold hover:bg-[var(--deep-blue)] book-now-btn"
            data-flight='${JSON.stringify(flight)}'>
            Book Now
          </button>
        </div>
      </div>
    `;
    resultsContainer.appendChild(flightCard);
  });

  // Add event listeners to all "Book Now" buttons
  document.querySelectorAll('.book-now-btn').forEach(button => {
    button.addEventListener('click', function() {
      const flightData = JSON.parse(this.getAttribute('data-flight'));
      
      // Save selected flight and search criteria to localStorage
      const bookingData = {
        flight: flightData,
        searchCriteria: searchCriteria,
        date: searchCriteria.date,
        selectedClass: searchCriteria.class
      };
      
      localStorage.setItem('selectedFlight', JSON.stringify(bookingData));
      
      // Redirect to booking page
      window.location.href = 'booking.html';
    });
  });
});