document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("flight-results");
  const selectedFlight = JSON.parse(localStorage.getItem("selectedFlight"));

  if (!selectedFlight) {
    resultsContainer.innerHTML = `
      <p class="text-red-600 text-center font-semibold">
        No flight data found. Please go back and search for flights.
      </p>
    `;
    return;
  }

  const flightCard = document.createElement("div");
  flightCard.className = "flight-card";

  flightCard.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
      <p><strong>From:</strong> ${selectedFlight.from}</p>
      <p><strong>To:</strong> ${selectedFlight.to}</p>
      <p><strong>Date:</strong> ${selectedFlight.date}</p>
      <p><strong>Class:</strong> ${selectedFlight.class}</p>
      <p><strong>Ticket ID:</strong> #${selectedFlight.ticketId}</p>
    </div>
    <div class="mt-2 text-right">
      <button onclick="window.location.href='booking.html'" class="bg-[var(--sky-blue)] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        Book This Flight
      </button>
    </div>
  `;

  resultsContainer.appendChild(flightCard);
});
