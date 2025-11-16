document.addEventListener("DOMContentLoaded", () => {
  const maintenanceForm = document.getElementById("maintenance-form");
  const maintenanceTable = document.getElementById("maintenance-table");
  const aircraftInput = document.getElementById("aircraft-id");
  const typeInput = document.getElementById("type");
  const dateInput = document.getElementById("date");
  const statusInput = document.getElementById("status");
  const remarksInput = document.getElementById("remarks");

  const records = JSON.parse(localStorage.getItem("maintenanceRecords")) || [];

  const renderRecords = () => {
    if (!records.length) {
      maintenanceTable.innerHTML = `<tr><td colspan="6" class="p-3 text-center text-gray-500">No records found</td></tr>`;
      return;
    }
    maintenanceTable.innerHTML = records.map((r, index) => `
      <tr class="hover:bg-gray-100 transition">
        <td>${r.aircraft}</td>
        <td>${r.type}</td>
        <td>${r.date}</td>
        <td>${r.status}</td>
        <td>${r.remarks || '-'}</td>
        <td>
          <button class="edit-btn text-sky-blue mr-2">Edit</button>
          <button class="delete-btn text-red-500">Delete</button>
        </td>
      </tr>
    `).join('');
  };

  maintenanceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newRecord = {
      id: Date.now(),
      aircraft: aircraftInput.value,
      type: typeInput.value,
      date: dateInput.value,
      status: statusInput.value,
      remarks: remarksInput.value
    };
    records.push(newRecord);
    localStorage.setItem("maintenanceRecords", JSON.stringify(records));
    renderRecords();
    maintenanceForm.reset();
  });

  maintenanceTable.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;
    const index = Array.from(maintenanceTable.rows).indexOf(row);
    if (e.target.classList.contains("delete-btn")) {
      if (confirm("Delete this record?")) {
        records.splice(index, 1);
        localStorage.setItem("maintenanceRecords", JSON.stringify(records));
        renderRecords();
      }
    } else if (e.target.classList.contains("edit-btn")) {
      const r = records[index];
      aircraftInput.value = r.aircraft;
      typeInput.value = r.type;
      dateInput.value = r.date;
      statusInput.value = r.status;
      remarksInput.value = r.remarks;
      records.splice(index, 1);
      localStorage.setItem("maintenanceRecords", JSON.stringify(records));
    }
  });

  // Initial render
  renderRecords();

  // Fade-in animation
  setTimeout(() => document.querySelectorAll(".fade-in").forEach(el => el.classList.add("visible")), 200);
});
