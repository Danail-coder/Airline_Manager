document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("staff-table");
  const formSection = document.getElementById("staff-form-section");
  const form = document.getElementById("staff-form");
  const addBtn = document.getElementById("add-staff-btn");
  const cancelBtn = document.getElementById("cancel-form");
  const formTitle = document.getElementById("form-title");
  const idField = document.getElementById("staff-id");

  // Mock Staff Data
  let staffList = [
    { id: "S001", name: "Capt. Kwame Mensah", position: "Pilot", license: "LIC-P101", flight: "FL101", contact: "+233501234567", status: "Active" },
    { id: "S002", name: "Akua Adom", position: "Cabin Crew", license: "CC-234", flight: "FL103", contact: "+233209876543", status: "Active" },
    { id: "S003", name: "Yaw Owusu", position: "Engineer", license: "EN-789", flight: "-", contact: "+233509999888", status: "On Leave" },
  ];

  // Render Staff Table
  function renderStaff() {
    table.innerHTML = "";
    staffList.forEach(s => {
      const row = `
        <tr class="hover:bg-gray-50">
          <td class="p-2 border-b">${s.id}</td>
          <td class="p-2 border-b">${s.name}</td>
          <td class="p-2 border-b">${s.position}</td>
          <td class="p-2 border-b">${s.license}</td>
          <td class="p-2 border-b">${s.flight}</td>
          <td class="p-2 border-b">${s.status}</td>
          <td class="p-2 border-b text-center">
            <button class="text-blue-600 hover:underline mr-2" onclick="editStaff('${s.id}')">Edit</button>
            <button class="text-red-600 hover:underline" onclick="deleteStaff('${s.id}')">Delete</button>
          </td>
        </tr>
      `;
      table.insertAdjacentHTML("beforeend", row);
    });
  }

  // Add Staff
  addBtn.addEventListener("click", () => {
    form.reset();
    idField.value = "";
    formTitle.textContent = "Add New Staff Member";
    formSection.classList.remove("hidden");
  });

  // Cancel Form
  cancelBtn.addEventListener("click", () => formSection.classList.add("hidden"));

  // Save Staff
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const staff = {
      id: idField.value || `S${Math.floor(Math.random() * 900 + 100)}`,
      name: form.name.value,
      position: form.position.value,
      license: form.license.value,
      flight: form.flight.value || "-",
      contact: form.contact.value,
      status: form.status.value,
    };

    if (idField.value) {
      staffList = staffList.map(s => s.id === idField.value ? staff : s);
    } else {
      staffList.push(staff);
    }

    renderStaff();
    formSection.classList.add("hidden");
  });

  // Edit
  window.editStaff = (id) => {
    const s = staffList.find(s => s.id === id);
    if (s) {
      formSection.classList.remove("hidden");
      formTitle.textContent = "Edit Staff Member";
      idField.value = s.id;
      form.name.value = s.name;
      form.position.value = s.position;
      form.license.value = s.license;
      form.flight.value = s.flight;
      form.contact.value = s.contact;
      form.status.value = s.status;
    }
  };

  // Delete
  window.deleteStaff = (id) => {
    if (confirm("Delete this staff member?")) {
      staffList = staffList.filter(s => s.id !== id);
      renderStaff();
    }
  };

  renderStaff();
});
