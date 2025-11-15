document.addEventListener("DOMContentLoaded", () => {
  const ticketDetails = document.getElementById("ticket-details");
  const ticketId = document.getElementById("ticket-id");
  const selectedFlight = JSON.parse(localStorage.getItem("selectedFlight"));

  if (!selectedFlight) {
    ticketDetails.innerHTML = `<p class="text-red-600 text-center">No booking data found. Please go back to booking.</p>`;
    return;
  }

  // Generate random ticket number
  ticketId.textContent = Math.floor(100000 + Math.random() * 900000);

  // Display ticket details
  ticketDetails.innerHTML = `
    <p><strong>Flight:</strong> ${selectedFlight.from} → ${selectedFlight.to}</p>
    <p><strong>Date:</strong> ${selectedFlight.date}</p>
    <p><strong>Class:</strong> ${selectedFlight.class}</p>
    <p><strong>Passenger:</strong> ${selectedFlight.passenger}</p>
    <p><strong>Email:</strong> ${selectedFlight.email || "—"}</p>
    <p><strong>Phone:</strong> ${selectedFlight.phone}</p>
    <p class="font-semibold text-blue-700 mt-2 text-lg">
      Total Fare: $${selectedFlight.price}
    </p>
  `;

  // Handle payment submission
  const paymentForm = document.getElementById("payment-form");
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const method = document.getElementById("payment-method").value;
    if (!method) {
      alert("Please select a payment method.");
      return;
    }

    // Simulate payment process
    alert(`Payment successful via ${method.toUpperCase()}!`);
    selectedFlight.paymentMethod = method;
    selectedFlight.ticketId = ticketId.textContent;

    localStorage.setItem("selectedFlight", JSON.stringify(selectedFlight));
    window.location.href = "confirmation.html";
  });
});
