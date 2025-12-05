// user-payment.js
document.addEventListener('DOMContentLoaded', () => {
  const paymentMethodSelect = document.getElementById('payment-method');
  const paymentFieldsDiv = document.getElementById('payment-fields');
  const paymentForm = document.getElementById('payment-form');
  const errorMessage = document.getElementById('error-message');
  const takeoffScreen = document.getElementById('takeoff-screen');
  const card = document.querySelector('.card');

  // Get complete booking data from localStorage
  const completeBooking = JSON.parse(localStorage.getItem('completeBooking'));

  if (!completeBooking) {
    alert('No booking information found. Please complete the booking process first.');
    window.location.href = 'search.html';
    return;
  }

  const { flight, passenger, searchCriteria } = completeBooking;

  // Create and insert booking summary above the payment form
  const bookingSummary = document.createElement('div');
  bookingSummary.className = 'mb-6';
  bookingSummary.innerHTML = `
    <!-- Flight Details Summary -->
    <div class="bg-blue-50 rounded-lg p-4 mb-4">
      <h2 class="text-lg font-bold text-[var(--sky-blue)] mb-3">Flight Details</h2>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Route:</span>
          <span class="font-semibold">${flight.from} (${flight.fromCode}) → ${flight.to} (${flight.toCode})</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Flight:</span>
          <span class="font-semibold">${flight.airline} - ${flight.flightNumber}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Date:</span>
          <span class="font-semibold">${searchCriteria.date}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Departure:</span>
          <span class="font-semibold">${flight.departureTime}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Arrival:</span>
          <span class="font-semibold">${flight.arrivalTime}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Duration:</span>
          <span class="font-semibold">${flight.duration}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Class:</span>
          <span class="font-semibold">${searchCriteria.class}</span>
        </div>
      </div>
    </div>

    <!-- Passenger Details Summary -->
    <div class="bg-green-50 rounded-lg p-4 mb-4">
      <h2 class="text-lg font-bold text-green-700 mb-3">Passenger Information</h2>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Name:</span>
          <span class="font-semibold">${passenger.fullName}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Email:</span>
          <span class="font-semibold">${passenger.email}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Phone:</span>
          <span class="font-semibold">${passenger.phone}</span>
        </div>
        ${passenger.dob ? `
        <div class="flex justify-between">
          <span class="text-gray-600">Date of Birth:</span>
          <span class="font-semibold">${passenger.dob}</span>
        </div>
        ` : ''}
        ${passenger.passport ? `
        <div class="flex justify-between">
          <span class="text-gray-600">Passport/ID:</span>
          <span class="font-semibold">${passenger.passport}</span>
        </div>
        ` : ''}
        ${passenger.nationality ? `
        <div class="flex justify-between">
          <span class="text-gray-600">Nationality:</span>
          <span class="font-semibold">${passenger.nationality}</span>
        </div>
        ` : ''}
        <div class="flex justify-between">
          <span class="text-gray-600">Gender:</span>
          <span class="font-semibold">${passenger.gender}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Seat Preference:</span>
          <span class="font-semibold">${passenger.seatPreference}</span>
        </div>
        ${passenger.specialRequests ? `
        <div class="flex justify-between">
          <span class="text-gray-600">Special Requests:</span>
          <span class="font-semibold">${passenger.specialRequests}</span>
        </div>
        ` : ''}
      </div>
    </div>

    <!-- Price Summary -->
    <div class="bg-yellow-50 rounded-lg p-4 mb-6">
      <div class="flex justify-between items-center">
        <span class="text-lg font-bold text-gray-700">Total Amount:</span>
        <span class="text-2xl font-bold text-[var(--sky-blue)]">$${flight.price}</span>
      </div>
      <p class="text-xs text-gray-500 mt-2">* Taxes and fees included</p>
    </div>
  `;

  // Insert booking summary before the h1 heading
  const heading = card.querySelector('h1');
  heading.insertAdjacentElement('afterend', bookingSummary);

  // Dynamic payment fields based on method
  paymentMethodSelect.addEventListener('change', function() {
    const method = this.value;
    paymentFieldsDiv.innerHTML = '';

    if (method === 'card') {
      paymentFieldsDiv.innerHTML = `
        <label class="block">
          <span class="text-sm sm:text-base font-medium text-gray-700">Card Number</span>
          <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required maxlength="19" class="mt-2 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
        </label>
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm sm:text-base font-medium text-gray-700">Expiry Date</span>
            <input type="text" id="expiry" placeholder="MM/YY" required maxlength="5" class="mt-2 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
          </label>
          <label class="block">
            <span class="text-sm sm:text-base font-medium text-gray-700">CVV</span>
            <input type="text" id="cvv" placeholder="123" required maxlength="4" class="mt-2 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
          </label>
        </div>
      `;
    } else if (method === 'momo') {
      paymentFieldsDiv.innerHTML = `
        <label class="block">
          <span class="text-sm sm:text-base font-medium text-gray-700">Mobile Money Number</span>
          <input type="tel" id="momo-number" placeholder="024 123 4567" required class="mt-2 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
        </label>
        <label class="block">
          <span class="text-sm sm:text-base font-medium text-gray-700">Provider</span>
          <select id="momo-provider" required class="mt-2 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">Select Provider</option>
            <option value="mtn">MTN Mobile Money</option>
            <option value="vodafone">Vodafone Cash</option>
            <option value="airtel">AirtelTigo Money</option>
          </select>
        </label>
      `;
    } else if (method === 'paypal') {
      paymentFieldsDiv.innerHTML = `
        <label class="block">
          <span class="text-sm sm:text-base font-medium text-gray-700">PayPal Email</span>
          <input type="email" id="paypal-email" placeholder="your@email.com" required class="mt-2 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
        </label>
      `;
    }
  });

  // Form submission
  paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const method = paymentMethodSelect.value;

    if (!method) {
      errorMessage.textContent = 'Please select a payment method.';
      errorMessage.classList.remove('hidden');
      return;
    }

    let paymentDetails = { method };

    // Validate and collect payment details based on method
    if (method === 'card') {
      const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
      const expiry = document.getElementById('expiry').value;
      const cvv = document.getElementById('cvv').value;

      if (cardNumber.length < 13) {
        errorMessage.textContent = 'Please enter a valid card number.';
        errorMessage.classList.remove('hidden');
        return;
      }

      if (!expiry.match(/^\d{2}\/\d{2}$/)) {
        errorMessage.textContent = 'Please enter expiry date in MM/YY format.';
        errorMessage.classList.remove('hidden');
        return;
      }

      if (cvv.length < 3) {
        errorMessage.textContent = 'Please enter a valid CVV.';
        errorMessage.classList.remove('hidden');
        return;
      }

      paymentDetails.cardLast4 = cardNumber.slice(-4);
      paymentDetails.methodName = 'Credit/Debit Card';
    } else if (method === 'momo') {
      const momoNumber = document.getElementById('momo-number').value;
      const provider = document.getElementById('momo-provider').value;

      if (!provider) {
        errorMessage.textContent = 'Please select a mobile money provider.';
        errorMessage.classList.remove('hidden');
        return;
      }

      if (momoNumber.length < 10) {
        errorMessage.textContent = 'Please enter a valid mobile money number.';
        errorMessage.classList.remove('hidden');
        return;
      }

      paymentDetails.momoNumber = momoNumber;
      paymentDetails.provider = provider;
      paymentDetails.methodName = 'Mobile Money - ' + provider.toUpperCase();
    } else if (method === 'paypal') {
      const paypalEmail = document.getElementById('paypal-email').value;

      if (!paypalEmail.includes('@')) {
        errorMessage.textContent = 'Please enter a valid PayPal email.';
        errorMessage.classList.remove('hidden');
        return;
      }

      paymentDetails.paypalEmail = paypalEmail;
      paymentDetails.methodName = 'PayPal';
    }

    errorMessage.classList.add('hidden');
    
    // Create final booking confirmation data
    const confirmationData = {
      ...completeBooking,
      payment: {
        ...paymentDetails,
        amount: flight.price,
        currency: 'USD',
        paymentDate: new Date().toISOString(),
        transactionId: 'TXN' + Date.now().toString().slice(-10),
        status: 'Completed'
      },
      bookingStatus: 'Confirmed',
      ticketNumber: 'TKT' + Date.now().toString().slice(-8)
    };

    // Save confirmation data to localStorage
    localStorage.setItem('bookingConfirmation', JSON.stringify(confirmationData));

    // Show takeoff animation
    takeoffScreen.classList.add('active');

    // Simulate payment processing and redirect
    setTimeout(() => {
      takeoffScreen.classList.remove('active');
      alert('Payment Successful! Your booking is confirmed.');
      window.location.href = 'confirmation.html';
    }, 3500);
  });
});