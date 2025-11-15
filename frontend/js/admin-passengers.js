document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("passenger-table");
  const formSection = document.getElementById("passenger-form-section");
  const form = document.getElementById("passenger-form");
  const addBtn = document.getElementById("add-passenger-btn");
  const cancelBtn = document.getElementById("cancel-form");
  const formTitle = document.getElementById("form-title");
  const idField = document.getElementById("passenger-id");

  // Mock Passenger Data
  let passengers = [
    { id: "P001", name: "Daniel Junior", passport: "GH123456", nationality: "Ghanaian", email: "daniel@mail.com", phone: "+233501234567", flight: "FL101", seat: "12A", status: "Checked-In" },
    { id: "P002", name: "Ama Serwaa", passport: "GH987654", nationality: "Ghanaian", email: "ama@mail.com", phone: "+233209876543", flight: "FL103", seat: "9B", status: "Pending" },
  ];

  // Render Passenger Table
  function renderPassengers() {
    table.innerHTML = "";
    passengers.forEach(p => {
      const row = `
        <tr class="hover:bg-gray-50">
          <td class="p-2 border-b">${p.id}</td>
          <td class="p-2 border-b">${p.name}</td>
          <td class="p-2 border-b">${p.passport}</td>
          <td class="p-2 border-b">${p.flight}</td>
          <td class="p-2 border-b">${p.seat}</td>
          <td class="p-2 border-b">${p.status}</td>
          <td class="p-2 border-b text-center">
            <button class="text-blue-600 hover:underline mr-2" onclick="editPassenger('${p.id}')">Edit</button>
            <button class="text-red-600 hover:underline" onclick="deletePassenger('${p.id}')">Delete</button>
          </td>
        </tr>
      `;
      table.insertAdjacentHTML("beforeend", row);
    });
  }

  // Add Passenger
  addBtn.addEventListener("click", () => {
    form.reset();
    idField.value = "";
    formTitle.textContent = "Add New Passenger";
    formSection.classList.remove("hidden");
  });

  // Cancel Form
  cancelBtn.addEventListener("click", () => formSection.classList.add("hidden"));

  // Save Passenger
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const passenger = {
      id: idField.value || `P${Math.floor(Math.random() * 900 + 100)}`,
      name: form.name.value,
      passport: form.passport.value,
      nationality: form.nationality.value,
      email: form.email.value,
      phone: form.phone.value,
      flight: form.flight.value,
      seat: form.seat.value,
      status: form.status.value,
    };

    if (idField.value) {
      passengers = passengers.map(p => p.id === idField.value ? passenger : p);
    } else {
      passengers.push(passenger);
    }

    renderPassengers();
    formSection.classList.add("hidden");
  });

  // Expose edit & delete
  window.editPassenger = (id) => {
    const p = passengers.find(p => p.id === id);
    if (p) {
      formSection.classList.remove("hidden");
      formTitle.textContent = "Edit Passenger";
      idField.value = p.id;
      form.name.value = p.name;
      form.passport.value = p.passport;
      form.nationality.value = p.nationality;
      form.email.value = p.email;
      form.phone.value = p.phone;
      form.flight.value = p.flight;
      form.seat.value = p.seat;
      form.status.value = p.status;
    }
  };

  window.deletePassenger = (id) => {
    if (confirm("Delete this passenger?")) {
      passengers = passengers.filter(p => p.id !== id);
      renderPassengers();
    }
  };

  renderPassengers();
});
