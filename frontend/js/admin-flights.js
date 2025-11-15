document.addEventListener("DOMContentLoaded", () => {
  const flightsTable = document.getElementById("flights-table");
  const addBtn = document.getElementById("add-flight-btn");
  const formSection = document.getElementById("flight-form-section");
  const form = document.getElementById("flight-form");
  const cancelBtn = document.getElementById("cancel-form");
  const formTitle = document.getElementById("form-title");
  const idField = document.getElementById("flight-id");

  // Mock Flight Data
  let flights = [
    { id: "FL101", from: "Accra", to: "Kumasi", date: "2025-11-10", duration: "1h 10m", aircraft: "Boeing 737", status: "Scheduled" },
    { id: "FL102", from: "Accra", to: "Lagos", date: "2025-11-12", duration: "2h 30m", aircraft: "Airbus A320", status: "Departed" },
    { id: "FL103", from: "Accra", to: "London", date: "2025-11-15", duration: "6h 45m", aircraft: "Boeing 787", status: "Completed" }
  ];

  function renderFlights() {
    flightsTable.innerHTML = "";
    flights.forEach(f => {
      const row = `
        <tr class="hover:bg-gray-50">
          <td class="p-2 border-b">${f.id}</td>
          <td class="p-2 border-b">${f.from} - ${f.to}</td>
          <td class="p-2 border-b">${f.date}</td>
          <td class="p-2 border-b">${f.duration}</td>
          <td class="p-2 border-b">${f.aircraft}</td>
          <td class="p-2 border-b">${f.status}</td>
          <td class="p-2 border-b text-center">
            <button class="text-blue-600 hover:underline mr-2" onclick="editFlight('${f.id}')">Edit</button>
            <button class="text-red-600 hover:underline" onclick="deleteFlight('${f.id}')">Delete</button>
          </td>
        </tr>
      `;
      flightsTable.insertAdjacentHTML("beforeend", row);
    });
  }

  // Add new flight
  addBtn.addEventListener("click", () => {
    form.reset();
    idField.value = "";
    formTitle.textContent = "Add New Flight";
    formSection.classList.remove("hidden");
  });

  // Cancel form
  cancelBtn.addEventListener("click", () => formSection.classList.add("hidden"));

  // Save flight
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const flight = {
      id: idField.value || `FL${Math.floor(Math.random() * 900 + 100)}`,
      from: form.from.value,
      to: form.to.value,
      date: form.date.value,
      duration: form.duration.value,
      aircraft: form.aircraft.value,
      status: form.status.value
    };

    if (idField.value) {
      flights = flights.map(f => f.id === idField.value ? flight : f);
    } else {
      flights.push(flight);
    }

    renderFlights();
    formSection.classList.add("hidden");
  });

  // Expose edit & delete globally
  window.editFlight = (id) => {
    const flight = flights.find(f => f.id === id);
    if (flight) {
      formSection.classList.remove("hidden");
      formTitle.textContent = "Edit Flight";
      idField.value = flight.id;
      form.from.value = flight.from;
      form.to.value = flight.to;
      form.date.value = flight.date;
      form.duration.value = flight.duration;
      form.aircraft.value = flight.aircraft;
      form.status.value = flight.status;
    }
  };

  window.deleteFlight = (id) => {
    if (confirm("Are you sure you want to delete this flight?")) {
      flights = flights.filter(f => f.id !== id);
      renderFlights();
    }
  };

  renderFlights();
});
