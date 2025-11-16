document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add-staff-btn");
  const formSection = document.getElementById("staff-form-section");
  const cancelBtn = document.getElementById("cancel-form");
  const staffForm = document.getElementById("staff-form");
  const staffTable = document.getElementById("staff-table");
  const formTitle = document.getElementById("form-title");

  let staffList = JSON.parse(localStorage.getItem("staffList")) || [];
  let editId = null;

  // Render table
  const renderTable = () => {
    staffTable.innerHTML = "";
    staffList.forEach((staff, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2 border-b">${idx + 1}</td>
        <td class="p-2 border-b">${staff.name}</td>
        <td class="p-2 border-b">${staff.position}</td>
        <td class="p-2 border-b">${staff.license}</td>
        <td class="p-2 border-b">${staff.flight}</td>
        <td class="p-2 border-b">${staff.status}</td>
        <td class="p-2 border-b text-center">
          <button data-id="${idx}" class="edit-btn text-blue-600 hover:underline mr-2">Edit</button>
          <button data-id="${idx}" class="delete-btn text-red-600 hover:underline">Delete</button>
        </td>
      `;
      staffTable.appendChild(row);
    });
  };

  // Show form
  addBtn.addEventListener("click", () => {
    formSection.classList.remove("hidden");
    formTitle.textContent = "Add New Staff Member";
    staffForm.reset();
    editId = null;
  });

  // Cancel form
  cancelBtn.addEventListener("click", () => {
    formSection.classList.add("hidden");
  });

  // Submit form
  staffForm.addEventListener("submit", e => {
    e.preventDefault();
    const staffData = {
      name: staffForm.name.value,
      position: staffForm.position.value,
      license: staffForm.license.value,
      flight: staffForm.flight.value,
      contact: staffForm.contact.value,
      status: staffForm.status.value
    };

    if (editId !== null) {
      staffList[editId] = staffData;
    } else {
      staffList.push(staffData);
    }

    localStorage.setItem("staffList", JSON.stringify(staffList));
    staffForm.reset();
    formSection.classList.add("hidden");
    renderTable();
  });

  // Edit / Delete
  staffTable.addEventListener("click", e => {
    if (e.target.classList.contains("edit-btn")) {
      const idx = e.target.dataset.id;
      editId = idx;
      const staff = staffList[idx];
      staffForm.name.value = staff.name;
      staffForm.position.value = staff.position;
      staffForm.license.value = staff.license;
      staffForm.flight.value = staff.flight;
      staffForm.contact.value = staff.contact;
      staffForm.status.value = staff.status;
      formSection.classList.remove("hidden");
      formTitle.textContent = "Edit Staff Member";
    }

    if (e.target.classList.contains("delete-btn")) {
      const idx = e.target.dataset.id;
      if (confirm("Are you sure you want to delete this staff member?")) {
        staffList.splice(idx, 1);
        localStorage.setItem("staffList", JSON.stringify(staffList));
        renderTable();
      }
    }
  });

  renderTable();
});
