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

  // Use shared PhoneInit helper when available
  let iti = null;
  const phoneInput = document.getElementById('phone');
  if (phoneInput && window.PhoneInit && window.intlTelInput) {
    iti = window.PhoneInit.init(phoneInput);
  }

  // Booking form submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('first-name') ? document.getElementById('first-name').value.trim() : '';
    const lastName = document.getElementById('last-name') ? document.getElementById('last-name').value.trim() : '';
    const email = document.getElementById('email').value.trim();
    const passenger = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : '';

    if (!passenger) {
      alert('Please enter passenger name.');
      return;
    }

    // If intl-tel-input (via PhoneInit) is initialized, use it for validation/formatting
    let finalPhone = '';
    if (window.PhoneInit && iti) {
      const formatted = window.PhoneInit.getE164(phoneInput);
      if (!formatted) {
        alert('Please enter a valid phone number for the selected country.');
        return;
      }
      finalPhone = formatted;
    } else {
      // Fallback: use raw input value
      const phoneNumber = document.getElementById('phone').value.trim();
      if (!phoneNumber) {
        alert('Please enter a phone number.');
        return;
      }
      finalPhone = phoneNumber;
    }

    const bookingInfo = { passenger, email, phone: finalPhone };
    localStorage.setItem('passengerInfo', JSON.stringify(bookingInfo));

    alert('Booking confirmed! ✈️');
    window.location.href = 'user-payment.html';
  });

});

// Note: country-code select population removed in favor of intl-tel-input
