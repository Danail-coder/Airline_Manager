// ../js/user-payment.js

document.addEventListener("DOMContentLoaded", () => {
  const ticketDetails = document.getElementById("ticket-details");
  const ticketIdEl = document.getElementById("ticket-id");
  const paymentForm = document.getElementById("payment-form");
  const paymentMethod = document.getElementById("payment-method");
  const errorMessage = document.getElementById("error-message");
  const takeoffScreen = document.getElementById("takeoff-screen");

  // Load booking details
  const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
  if (!bookingDetails) {
    ticketDetails.innerHTML = `<p class="text-gray-500">No booking details found. Go back to search.</p>`;
    return;
  }

  // Generate random ticket ID
  const ticketId = Math.floor(1000 + Math.random() * 9000);
  ticketIdEl.textContent = ticketId;

  // Populate ticket info
  const { flight, passenger } = bookingDetails;
  ticketDetails.innerHTML = `
    <p><strong>Passenger:</strong> ${passenger.passenger}</p>
    <p><strong>Email:</strong> ${passenger.email || "N/A"}</p>
    <p><strong>Phone:</strong> ${passenger.phone}</p>
    <p><strong>From:</strong> ${flight.from}</p>
    <p><strong>To:</strong> ${flight.to}</p>
    <p><strong>Date:</strong> ${flight.date}</p>
    <p><strong>Time:</strong> ${flight.time}</p>
    <p><strong>Seats:</strong> ${flight.seats}</p>
  `;

  // Handle payment submission
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const method = paymentMethod.value;

    if (!method) {
      errorMessage.textContent = "Please select a payment method.";
      errorMessage.classList.remove("hidden");
      return;
    }

    errorMessage.classList.add("hidden");

    // Show takeoff overlay
    takeoffScreen.classList.add("active");

    // Simulate payment processing
    setTimeout(() => {
      localStorage.setItem("ticketId", ticketId); // save ticket
      window.location.href = "confirmation.html";
    }, 3500);
  });
});
