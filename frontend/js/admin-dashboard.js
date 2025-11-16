document.addEventListener("DOMContentLoaded", () => {
  // Set current date
  const currentDateEl = document.getElementById("current-date");
  const today = new Date();
  currentDateEl.textContent = today.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Retrieve stored data or initialize
  const flights = JSON.parse(localStorage.getItem("flights")) || [];
  const passengers = JSON.parse(localStorage.getItem("passengers")) || [];
  const maintenanceTasks = JSON.parse(localStorage.getItem("maintenanceTasks")) || [];

  // Populate summary cards
  document.getElementById("total-flights").textContent = flights.length;
  document.getElementById("total-passengers").textContent = passengers.length;
  const revenue = flights.reduce((sum, flight) => sum + (flight.price || 0), 0);
  document.getElementById("total-revenue").textContent = `$${revenue.toLocaleString()}`;
  document.getElementById("total-maintenance").textContent = maintenanceTasks.length;

  // Populate recent flights table
  const recentFlightsEl = document.getElementById("recent-flights");
  if (flights.length === 0) {
    recentFlightsEl.innerHTML = `
      <tr>
        <td colspan="4" class="p-3 text-center text-gray-500">No flights found</td>
      </tr>
    `;
  } else {
    recentFlightsEl.innerHTML = flights
      .slice(-5).reverse() // Show last 5 flights
      .map(flight => `
        <tr class="hover:bg-sky-blue-light transition">
          <td class="p-2 border-b">${flight.id || "—"}</td>
          <td class="p-2 border-b">${flight.from} → ${flight.to}</td>
          <td class="p-2 border-b">${flight.status || "Scheduled"}</td>
          <td class="p-2 border-b">${flight.date}</td>
        </tr>
      `).join('');
  }

  // Animate summary cards
  const cards = document.querySelectorAll("section.grid div.fade-in");
  cards.forEach((card, i) => {
    setTimeout(() => card.classList.add("visible"), i * 150);
  });
});
