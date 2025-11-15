document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("maintenance-form");
  const table = document.getElementById("maintenance-table");

  let maintenanceRecords = JSON.parse(localStorage.getItem("maintenanceRecords")) || [];

  const getAircraftImage = (id) => {
    const lower = id.toLowerCase();
    if (lower.includes("a320")) return "assets/aircrafts/a320.jpg";
    if (lower.includes("b737")) return "assets/aircrafts/b737.jpg";
    if (lower.includes("embraer")) return "assets/aircrafts/embraer.jpg";
    return "assets/aircrafts/default.jpg";
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-white text-xs font-semibold";
    switch (status) {
      case "Completed":
        return `<span class="${base} bg-green-600">${status}</span>`;
      case "In Progress":
        return `<span class="${base} bg-yellow-500">${status}</span>`;
      default:
        return `<span class="${base} bg-red-500">${status}</span>`;
    }
  };

  const renderTable = () => {
    table.innerHTML = "";
    if (maintenanceRecords.length === 0) {
      table.innerHTML = `<tr><td colspan="6" class="text-center p-3 text-gray-500">No records yet</td></tr>`;
      return;
    }

    maintenanceRecords.forEach((record, index) => {
      const row = document.createElement("tr");
      row.className = "hover:bg-gray-50 transition";
      row.innerHTML = `
        <td class="p-3 flex items-center gap-3">
          <img src="${getAircraftImage(record.aircraftId)}" class="w-16 h-12 object-cover rounded border" alt="${record.aircraftId}" />
          <div>
            <div class="font-medium">${record.aircraftId}</div>
          </div>
        </td>
        <td class="p-3">${record.type}</td>
        <td class="p-3">${record.date}</td>
        <td class="p-3">${getStatusBadge(record.status)}</td>
        <td class="p-3">${record.remarks || "—"}</td>
        <td class="p-3 space-x-2">
          <button class="text-blue-600 hover:underline" data-edit="${index}">Edit</button>
          <button class="text-red-600 hover:underline" data-delete="${index}">Delete</button>
        </td>
      `;
      table.appendChild(row);
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    maintenanceRecords.push(data);
    localStorage.setItem("maintenanceRecords", JSON.stringify(maintenanceRecords));
    form.reset();
    renderTable();
  });

  table.addEventListener("click", (e) => {
    if (e.target.dataset.delete !== undefined) {
      const index = e.target.dataset.delete;
      maintenanceRecords.splice(index, 1);
      localStorage.setItem("maintenanceRecords", JSON.stringify(maintenanceRecords));
      renderTable();
    } else if (e.target.dataset.edit !== undefined) {
      const record = maintenanceRecords[e.target.dataset.edit];
      for (let key in record) {
        if (form.elements[key]) form.elements[key].value = record[key];
      }
      maintenanceRecords.splice(e.target.dataset.edit, 1);
      localStorage.setItem("maintenanceRecords", JSON.stringify(maintenanceRecords));
      renderTable();
    }
  });

  renderTable();
});
