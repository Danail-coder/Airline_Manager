// ../js/results.js

document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("flight-results");

  // Mock flight results data
  const flights = [
    {
      airline: "SkyWings Airlines",
      flightNo: "SW123",
      from: "Accra",
      to: "London",
      departure: "2025-12-01 08:00",
      arrival: "2025-12-01 16:00",
      duration: "8h",
      price: 1200
    },
    {
      airline: "SkyWings Airlines",
      flightNo: "SW456",
      from: "Accra",
      to: "London",
      departure: "2025-12-01 14:00",
      arrival: "2025-12-01 22:00",
      duration: "8h",
      price: 1150
    },
    {
      airline: "Global Air",
      flightNo: "GA789",
      from: "Accra",
      to: "London",
      departure: "2025-12-01 20:00",
      arrival: "2025-12-02 04:00",
      duration: "8h",
      price: 1300
    }
  ];

  // Render flights
  flights.forEach(flight => {
    const flightCard = document.createElement("div");
    flightCard.className = "p-4 border border-gray-200 rounded-lg hover:shadow-md transition";

    flightCard.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-semibold text-[var(--sky-blue)]">${flight.airline} - ${flight.flightNo}</h3>
        <span class="font-bold text-gray-700">$${flight.price}</span>
      </div>
      <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div><strong>From:</strong> ${flight.from}</div>
        <div><strong>To:</strong> ${flight.to}</div>
        <div><strong>Departure:</strong> ${flight.departure}</div>
        <div><strong>Arrival:</strong> ${flight.arrival}</div>
        <div><strong>Duration:</strong> ${flight.duration}</div>
      </div>
      <div class="mt-3 text-right">
        <button onclick="bookFlight('${flight.flightNo}')" class="bg-[var(--sky-blue)] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Book
        </button>
      </div>
    `;

    resultsContainer.appendChild(flightCard);
  });
});

// Mock function to handle booking click
function bookFlight(flightNo) {
  // Save flight info in localStorage to pass to booking page
  localStorage.setItem("selectedFlight", flightNo);
  // Redirect to booking page
  window.location.href = "booking.html";
}
