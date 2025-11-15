document.addEventListener("DOMContentLoaded", () => {
  // Mock Data
  const flights = [
    { id: "FL101", route: "Accra - Kumasi", status: "Scheduled", date: "2025-11-05" },
    { id: "FL102", route: "Accra - Lagos", status: "Departed", date: "2025-11-04" },
    { id: "FL103", route: "Accra - London", status: "Cancelled", date: "2025-11-03" },
    { id: "FL104", route: "Kumasi - Accra", status: "Completed", date: "2025-11-02" }
  ];

  const passengers = 842;
  const revenue = 12750;
  const maintenanceTasks = 4;

  // Update Dashboard Stats
  document.getElementById("total-flights").textContent = flights.length;
  document.getElementById("total-passengers").textContent = passengers;
  document.getElementById("total-revenue").textContent = `$${revenue.toLocaleString()}`;
  document.getElementById("total-maintenance").textContent = maintenanceTasks;

  // Display Date
  const dateEl = document.getElementById("current-date");
  dateEl.textContent = new Date().toDateString();

  // Populate Recent Flights
  const tableBody = document.getElementById("recent-flights");
  flights.forEach(f => {
    const row = `
      <tr class="hover:bg-gray-50">
        <td class="p-2 border-b">${f.id}</td>
        <td class="p-2 border-b">${f.route}</td>
        <td class="p-2 border-b">${f.status}</td>
        <td class="p-2 border-b">${f.date}</td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
});
