document.addEventListener("DOMContentLoaded", () => {
  const flights = JSON.parse(localStorage.getItem("flights")) || [];

  const flightsTable = document.getElementById("flights-table");
  const flightFormSection = document.getElementById("flight-form-section");
  const flightForm = document.getElementById("flight-form");
  const addBtn = document.getElementById("add-flight-btn");
  const cancelBtn = document.getElementById("cancel-form");
  const formTitle = document.getElementById("form-title");

  const renderFlights = () => {
    if (flights.length === 0) {
      flightsTable.innerHTML = `<tr><td colspan="7" class="p-3 text-center text-gray-500">No flights found</td></tr>`;
      return;
    }
    flightsTable.innerHTML = flights
      .map((f, index) => `
        <tr class="hover:bg-sky-blue-light transition">
          <td class="p-2 border-b">${f.id || index + 1}</td>
          <td class="p-2 border-b">${f.from} → ${f.to}</td>
          <td class="p-2 border-b">${f.date}</td>
          <td class="p-2 border-b">${f.duration}</td>
          <td class="p-2 border-b">${f.aircraft}</td>
          <td class="p-2 border-b">${f.status}</td>
          <td class="p-2 border-b text-center">
            <button class="edit-btn text-blue-700 mr-2">Edit</button>
            <button class="delete-btn text-red-500">Delete</button>
          </td>
        </tr>
      `).join('');
  };

  // Show Add Form
  addBtn.addEventListener("click", () => {
    flightFormSection.classList.remove("hidden");
    flightForm.reset();
    formTitle.textContent = "Add New Flight";
  });

  // Cancel Form
  cancelBtn.addEventListener("click", () => flightFormSection.classList.add("hidden"));

  // Handle Add/Edit Flight
  flightForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const flightData = {
      id: document.getElementById("flight-id").value || Date.now(),
      from: document.getElementById("from").value,
      to: document.getElementById("to").value,
      date: document.getElementById("date").value,
      duration: document.getElementById("duration").value,
      aircraft: document.getElementById("aircraft").value,
      status: document.getElementById("status").value
    };

    const editIndex = flights.findIndex(f => f.id == flightData.id);
    if (editIndex >= 0) flights[editIndex] = flightData;
    else flights.push(flightData);

    localStorage.setItem("flights", JSON.stringify(flights));
    renderFlights();
    flightFormSection.classList.add("hidden");
  });

  // Edit/Delete Buttons
  flightsTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const rowIndex = e.target.closest("tr").rowIndex - 1;
      const f = flights[rowIndex];
      flightFormSection.classList.remove("hidden");
      formTitle.textContent = "Edit Flight";
      document.getElementById("flight-id").value = f.id;
      document.getElementById("from").value = f.from;
      document.getElementById("to").value = f.to;
      document.getElementById("date").value = f.date;
      document.getElementById("duration").value = f.duration;
      document.getElementById("aircraft").value = f.aircraft;
      document.getElementById("status").value = f.status;
    }
    if (e.target.classList.contains("delete-btn")) {
      const rowIndex = e.target.closest("tr").rowIndex - 1;
      if (confirm("Are you sure you want to delete this flight?")) {
        flights.splice(rowIndex, 1);
        localStorage.setItem("flights", JSON.stringify(flights));
        renderFlights();
      }
    }
  });

  // Initial render
  renderFlights();

  // Animate form and table
  setTimeout(() => {
    flightFormSection.classList.add("visible");
    document.querySelectorAll(".fade-in").forEach(el => el.classList.add("visible"));
  }, 200);
});
