document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settings-form");
  const status = document.getElementById("statusMessage");

  // Load saved settings from localStorage
  const airlineNameInput = document.getElementById("airlineName");
  const themeColorSelect = document.getElementById("themeColor");
  const timezoneSelect = document.getElementById("timezone");

  airlineNameInput.value = localStorage.getItem("airlineName") || "";
  themeColorSelect.value = localStorage.getItem("themeColor") || "blue";
  timezoneSelect.value = localStorage.getItem("timezone") || "GMT";

  form.addEventListener("submit", e => {
    e.preventDefault();

    localStorage.setItem("airlineName", airlineNameInput.value);
    localStorage.setItem("themeColor", themeColorSelect.value);
    localStorage.setItem("timezone", timezoneSelect.value);

    status.classList.remove("hidden");
    setTimeout(() => status.classList.add("hidden"), 3000);
  });
});
