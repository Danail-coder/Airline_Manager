// -----------------------------
// SkyWings Booking JS
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {

  const flightSummary = document.getElementById('flight-summary');
  const bookingForm = document.getElementById('booking-form');

  // Load selected flight from localStorage
  const flightData = JSON.parse(localStorage.getItem('selectedFlight'));
  if (flightData) {
    flightSummary.innerHTML = `
      <h2 class="font-semibold text-lg mb-2">Flight Summary</h2>
      <p><strong>From:</strong> ${flightData.from}</p>
      <p><strong>To:</strong> ${flightData.to}</p>
      <p><strong>Date:</strong> ${flightData.date}</p>
      <p><strong>Time:</strong> ${flightData.time || '—'}</p>
      <p><strong>Seats:</strong> ${flightData.seats || '—'}</p>
    `;
  } else {
    flightSummary.innerHTML = `<p class="text-gray-500">No flight selected yet.</p>`;
  }

  // Booking form submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const passenger = document.getElementById('passenger').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!passenger || !phone) {
      alert('Please fill in all required fields.');
      return;
    }

    const bookingInfo = { passenger, email, phone };
    localStorage.setItem('passengerInfo', JSON.stringify(bookingInfo));

    alert('Booking confirmed! ✈️');
    window.location.href = 'user-payment.html';
  });

});
