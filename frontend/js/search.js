document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const date = document.getElementById("date").value;
    const travelClass = document.getElementById("class").value;

    if (!from || !to || !date) {
      alert("Please fill all fields.");
      return;
    }

    const searchData = { from, to, date, class: travelClass };

    // Save to localStorage
    localStorage.setItem("searchData", JSON.stringify(searchData));

    // Redirect to results page
    window.location.href = "results.html";
  });
});
