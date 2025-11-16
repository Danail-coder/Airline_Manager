// ../js/booking.js

document.addEventListener("DOMContentLoaded", () => {
  const flightSummary = document.getElementById('flight-summary');
  const bookingForm = document.getElementById('booking-form');

  // Load selected flight data from localStorage
  const flightData = JSON.parse(localStorage.getItem('selectedFlight'));

  if (flightData) {
    flightSummary.innerHTML = `
      <h2 class="font-semibold text-lg mb-2">Flight Summary</h2>
      <p><strong>From:</strong> ${flightData.from}</p>
      <p><strong>To:</strong> ${flightData.to}</p>
      <p><strong>Date:</strong> ${flightData.date || flightData.departure}</p>
      <p><strong>Time:</strong> ${flightData.time || flightData.departure}</p>
      <p><strong>Seats:</strong> ${flightData.seats || 1}</p>
      <p><strong>Flight No:</strong> ${flightData.flightNo || flightData}</p>
    `;
  } else {
    flightSummary.innerHTML = `<p class="text-gray-500">No flight selected yet.</p>`;
  }

  // Handle form submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const passenger = document.getElementById('passenger').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!passenger || !phone) {
      alert('Please fill in all required fields.');
      return;
    }

    // Save passenger info in localStorage
    const passengerInfo = { passenger, email, phone };
    localStorage.setItem('passengerInfo', JSON.stringify(passengerInfo));

    // Optional: combine flight + passenger info for payment
    const bookingDetails = {
      flight: flightData,
      passenger: passengerInfo
    };
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));

    alert('Booking confirmed! ✈️');

    // Redirect to payment page
    window.location.href = 'user-payment.html';
  });
});
