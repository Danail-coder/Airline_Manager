document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const date = document.getElementById("date").value;
    const flightClass = document.getElementById("class").value;

    if (!from || !to || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    const flightData = {
      from,
      to,
      date,
      class: flightClass,
      ticketId: Math.floor(100000 + Math.random() * 900000)
    };

    // Save to localStorage for results page
    localStorage.setItem("selectedFlight", JSON.stringify(flightData));

    // Redirect to results page
    window.location.href = "results.html";
  });
});
