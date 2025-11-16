document.addEventListener("DOMContentLoaded", () => {
  const formSection = document.getElementById("passenger-form-section");
  const addBtn = document.getElementById("add-passenger-btn");
  const cancelBtn = document.getElementById("cancel-form");
  const passengerForm = document.getElementById("passenger-form");
  const passengerTable = document.getElementById("passenger-table");

  const inputs = {
    id: document.getElementById("passenger-id"),
    name: document.getElementById("name"),
    passport: document.getElementById("passport"),
    nationality: document.getElementById("nationality"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    flight: document.getElementById("flight"),
    seat: document.getElementById("seat"),
    status: document.getElementById("status")
  };

  const passengers = JSON.parse(localStorage.getItem("passengers")) || [];

  const renderPassengers = () => {
    if (!passengers.length) {
      passengerTable.innerHTML = `<tr><td colspan="7" class="p-3 text-center text-gray-500">No passengers found</td></tr>`;
      return;
    }
    passengerTable.innerHTML = passengers.map((p, idx) => `
      <tr class="hover:bg-gray-100 transition">
        <td>${idx + 1}</td>
        <td>${p.name}</td>
        <td>${p.passport}</td>
        <td>${p.flight}</td>
        <td>${p.seat}</td>
        <td>${p.status}</td>
        <td class="text-center">
          <button class="edit-btn text-sky-blue mr-2">Edit</button>
          <button class="delete-btn text-red-500">Delete</button>
        </td>
      </tr>
    `).join('');
  };

  addBtn.addEventListener("click", () => formSection.classList.remove("hidden"));
  cancelBtn.addEventListener("click", () => {
    formSection.classList.add("hidden");
    passengerForm.reset();
  });

  passengerForm.addEventListener("submit", e => {
    e.preventDefault();
    const newPassenger = {
      id: Date.now(),
      name: inputs.name.value,
      passport: inputs.passport.value,
      nationality: inputs.nationality.value,
      email: inputs.email.value,
      phone: inputs.phone.value,
      flight: inputs.flight.value,
      seat: inputs.seat.value,
      status: inputs.status.value
    };
    passengers.push(newPassenger);
    localStorage.setItem("passengers", JSON.stringify(passengers));
    renderPassengers();
    passengerForm.reset();
    formSection.classList.add("hidden");
  });

  passengerTable.addEventListener("click", e => {
    const row = e.target.closest("tr");
    if (!row) return;
    const index = Array.from(passengerTable.rows).indexOf(row);
    if (e.target.classList.contains("delete-btn")) {
      if (confirm("Delete this passenger?")) {
        passengers.splice(index, 1);
        localStorage.setItem("passengers", JSON.stringify(passengers));
        renderPassengers();
      }
    } else if (e.target.classList.contains("edit-btn")) {
      const p = passengers[index];
      inputs.id.value = p.id;
      inputs.name.value = p.name;
      inputs.passport.value = p.passport;
      inputs.nationality.value = p.nationality;
      inputs.email.value = p.email;
      inputs.phone.value = p.phone;
      inputs.flight.value = p.flight;
      inputs.seat.value = p.seat;
      inputs.status.value = p.status;
      passengers.splice(index, 1);
      localStorage.setItem("passengers", JSON.stringify(passengers));
      formSection.classList.remove("hidden");
    }
  });

  // Fade-in animations
  setTimeout(() => document.querySelectorAll(".fade-in").forEach(el => el.classList.add("visible")), 200);

  renderPassengers();
});
