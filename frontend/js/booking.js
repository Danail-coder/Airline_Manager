document.addEventListener("DOMContentLoaded", () => {
  const summaryDiv = document.getElementById("flight-summary");
  const selectedFlight = JSON.parse(localStorage.getItem("selectedFlight"));

  if (!selectedFlight) {
    summaryDiv.innerHTML = `<p class="text-red-600 text-center">No flight selected. Please go back to search.</p>`;
    return;
  }

  // Display flight summary
  summaryDiv.innerHTML = `
    <p><strong>Airline:</strong> ${selectedFlight.airline}</p>
    <p><strong>Route:</strong> ${selectedFlight.from} → ${selectedFlight.to}</p>
    <p><strong>Date:</strong> ${selectedFlight.date}</p>
    <p><strong>Time:</strong> ${selectedFlight.time}</p>
    <p><strong>Class:</strong> ${selectedFlight.class}</p>
    <p><strong>Fare:</strong> $${selectedFlight.price}</p>
  `;

  // Handle form submission
  const form = document.getElementById("booking-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const passenger = document.getElementById("passenger").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!passenger || !phone) {
      alert("Please fill in all required fields.");
      return;
    }

    // Update booking data
    selectedFlight.passenger = passenger;
    selectedFlight.email = email;
    selectedFlight.phone = phone;

    localStorage.setItem("selectedFlight", JSON.stringify(selectedFlight));

    // Go to payment
    window.location.href = "user-payment.html";
  });
});
