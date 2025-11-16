// ../js/search.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const date = document.getElementById("date").value;
    const travelClass = document.getElementById("class").value;

    // Basic validation
    if (!from || !to || !date || !travelClass) {
      alert("Please fill in all search fields.");
      return;
    }

    if (from.toLowerCase() === to.toLowerCase()) {
      alert("Departure and destination cannot be the same.");
      return;
    }

    // Save search query to localStorage
    const searchQuery = { from, to, date, travelClass };
    localStorage.setItem("skywingsSearchQuery", JSON.stringify(searchQuery));

    // Redirect to results page
    window.location.href = "./results.html";
  });
});
