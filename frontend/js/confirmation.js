// confirmation.js
document.addEventListener('DOMContentLoaded', () => {
  const downloadBtn = document.getElementById('download-ticket');

  // Get booking confirmation data from localStorage
  const confirmationData = JSON.parse(localStorage.getItem('bookingConfirmation'));

  if (!confirmationData) {
    alert('No booking confirmation found. Please complete the booking process first.');
    window.location.href = 'search.html';
    return;
  }

  const { flight, passenger, searchCriteria, payment, ticketNumber, bookingReference } = confirmationData;

  // Helper function to format date and time
  function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Populate Passenger Information
  const passengerSection = document.querySelector('.section-spacing:nth-of-type(1) .info-grid');
  passengerSection.innerHTML = `
    <div class="info-box">
      <div class="label">Full Name</div>
      <div class="value">${passenger.fullName}</div>
    </div>
    <div class="info-box">
      <div class="label">Email</div>
      <div class="value">${passenger.email}</div>
    </div>
    <div class="info-box">
      <div class="label">Phone</div>
      <div class="value">${passenger.phone}</div>
    </div>
    <div class="info-box">
      <div class="label">Gender</div>
      <div class="value">${passenger.gender}</div>
    </div>
    ${passenger.passport ? `
    <div class="info-box">
      <div class="label">Passport/ID</div>
      <div class="value">${passenger.passport}</div>
    </div>
    ` : ''}
    ${passenger.nationality ? `
    <div class="info-box">
      <div class="label">Nationality</div>
      <div class="value">${passenger.nationality}</div>
    </div>
    ` : ''}
    ${passenger.dob ? `
    <div class="info-box">
      <div class="label">Date of Birth</div>
      <div class="value">${passenger.dob}</div>
    </div>
    ` : ''}
    <div class="info-box">
      <div class="label">Seat Preference</div>
      <div class="value">${passenger.seatPreference}</div>
    </div>
    ${passenger.specialRequests ? `
    <div class="info-box">
      <div class="label">Special Requests</div>
      <div class="value">${passenger.specialRequests}</div>
    </div>
    ` : ''}
  `;

  // Populate Flight Details
  const flightSection = document.querySelector('.section-spacing:nth-of-type(2) .info-grid');
  flightSection.innerHTML = `
    <div class="info-box">
      <div class="label">From</div>
      <div class="value">${flight.from} (${flight.fromCode})</div>
    </div>
    <div class="info-box">
      <div class="label">To</div>
      <div class="value">${flight.to} (${flight.toCode})</div>
    </div>
    <div class="info-box">
      <div class="label">Flight Date</div>
      <div class="value">${searchCriteria.date}</div>
    </div>
    <div class="info-box">
      <div class="label">Departure Time</div>
      <div class="value">${flight.departureTime}</div>
    </div>
    <div class="info-box">
      <div class="label">Arrival Time</div>
      <div class="value">${flight.arrivalTime}</div>
    </div>
    <div class="info-box">
      <div class="label">Duration</div>
      <div class="value">${flight.duration}</div>
    </div>
    <div class="info-box">
      <div class="label">Airline</div>
      <div class="value">${flight.airline}</div>
    </div>
    <div class="info-box">
      <div class="label">Flight Number</div>
      <div class="value">${flight.flightNumber}</div>
    </div>
    <div class="info-box">
      <div class="label">Aircraft</div>
      <div class="value">${flight.aircraft}</div>
    </div>
    <div class="info-box">
      <div class="label">Class</div>
      <div class="value">${searchCriteria.class}</div>
    </div>
    <div class="info-box">
      <div class="label">Stops</div>
      <div class="value">${flight.stops}</div>
    </div>
    <div class="info-box">
      <div class="label">Booking Reference</div>
      <div class="value">${bookingReference}</div>
    </div>
  `;

  // Populate Payment Details
  const paymentSection = document.querySelector('.section-spacing:nth-of-type(3) .info-grid');
  paymentSection.innerHTML = `
    <div class="info-box">
      <div class="label">Payment Method</div>
      <div class="value">${payment.methodName}</div>
    </div>
    <div class="info-box">
      <div class="label">Ticket Number</div>
      <div class="value">${ticketNumber}</div>
    </div>
    <div class="info-box">
      <div class="label">Amount Paid</div>
      <div class="value">$${payment.amount} ${payment.currency}</div>
    </div>
    <div class="info-box">
      <div class="label">Transaction ID</div>
      <div class="value">${payment.transactionId}</div>
    </div>
    <div class="info-box">
      <div class="label">Payment Status</div>
      <div class="value">${payment.status}</div>
    </div>
    <div class="info-box">
      <div class="label">Payment Date</div>
      <div class="value">${formatDateTime(payment.paymentDate)}</div>
    </div>
  `;

  // Download Ticket Functionality
  downloadBtn.addEventListener('click', function() {
    // Create a printable ticket summary
    const ticketContent = `
════════════════════════════════════════════
          SKYWINGS AIRWAYS
        E-TICKET CONFIRMATION
════════════════════════════════════════════

BOOKING REFERENCE: ${bookingReference}
TICKET NUMBER: ${ticketNumber}

────────────────────────────────────────────
PASSENGER INFORMATION
────────────────────────────────────────────
Name: ${passenger.fullName}
Email: ${passenger.email}
Phone: ${passenger.phone}
${passenger.passport ? `Passport/ID: ${passenger.passport}` : ''}

────────────────────────────────────────────
FLIGHT DETAILS
────────────────────────────────────────────
${flight.airline} - Flight ${flight.flightNumber}
${flight.from} (${flight.fromCode}) → ${flight.to} (${flight.toCode})

Date: ${searchCriteria.date}
Departure: ${flight.departureTime}
Arrival: ${flight.arrivalTime}
Duration: ${flight.duration}

Class: ${searchCriteria.class}
Seat: ${passenger.seatPreference}
Aircraft: ${flight.aircraft}

────────────────────────────────────────────
PAYMENT INFORMATION
────────────────────────────────────────────
Amount Paid: $${payment.amount} ${payment.currency}
Payment Method: ${payment.methodName}
Transaction ID: ${payment.transactionId}
Status: ${payment.status}

────────────────────────────────────────────
IMPORTANT INFORMATION
────────────────────────────────────────────
- Please arrive at the airport at least 2 hours
  before departure for international flights
- Carry a valid ID/Passport
- Check-in opens 3 hours before departure

Thank you for choosing SkyWings Airways!
Safe travels!

════════════════════════════════════════════
    `;

    // Create a blob and download
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkyWings-Ticket-${ticketNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    alert('Your ticket has been downloaded successfully!');
  });
});