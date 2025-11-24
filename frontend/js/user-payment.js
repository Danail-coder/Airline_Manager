const paymentForm = document.getElementById('payment-form');
const paymentMethodSelect = document.getElementById('payment-method');
const paymentFields = document.getElementById('payment-fields');
const errorMessage = document.getElementById('error-message');
const takeoffScreen = document.getElementById('takeoff-screen');

// Show dynamic fields based on payment method
paymentMethodSelect.addEventListener('change', () => {
  const method = paymentMethodSelect.value;
  errorMessage.classList.add('hidden');
  paymentFields.innerHTML = '';

  if (method === 'card') {
    paymentFields.innerHTML = `
      <label>Card Number<input type="text" id="card-number" placeholder="1234 5678 9012 3456" required></label>
      <label>Expiry Date<input type="text" id="card-expiry" placeholder="MM/YY" required></label>
      <label>CVV<input type="text" id="card-cvv" placeholder="123" required></label>
    `;
  } else if (method === 'momo') {
    paymentFields.innerHTML = `
      <label>Mobile Number<input type="tel" id="momo-number" placeholder="+233 24 123 4567" required></label>
      <label>PIN<input type="password" id="momo-pin" placeholder="****" required></label>
    `;
  } else if (method === 'paypal') {
    paymentFields.innerHTML = `
      <label>PayPal Email<input type="email" id="paypal-email" placeholder="email@example.com" required></label>
    `;
  }
});

// Handle form submission
paymentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const method = paymentMethodSelect.value;

  if (!method) {
    errorMessage.textContent = 'Please select a payment method.';
    errorMessage.classList.remove('hidden');
    return;
  }

  // Validate dynamic fields
  if (method === 'card') {
    const card = document.getElementById('card-number').value.trim();
    const expiry = document.getElementById('card-expiry').value.trim();
    const cvv = document.getElementById('card-cvv').value.trim();
    if (!card || !expiry || !cvv) {
      errorMessage.textContent = 'Please fill all card details.';
      errorMessage.classList.remove('hidden');
      return;
    }
  } else if (method === 'momo') {
    const number = document.getElementById('momo-number').value.trim();
    const pin = document.getElementById('momo-pin').value.trim();
    if (!number || !pin) {
      errorMessage.textContent = 'Please enter your mobile number and PIN.';
      errorMessage.classList.remove('hidden');
      return;
    }
  } else if (method === 'paypal') {
    const email = document.getElementById('paypal-email').value.trim();
    if (!email) {
      errorMessage.textContent = 'Please enter your PayPal email.';
      errorMessage.classList.remove('hidden');
      return;
    }
  }

  // Show takeoff animation
  takeoffScreen.classList.add('active');

  // Simulate payment processing
  setTimeout(() => {
    localStorage.setItem('paymentMethod', method);
    takeoffScreen.classList.remove('active');
    alert('Payment Successful! ✈️');
    window.location.href = 'confirmation.html';
  }, 3500);
});
