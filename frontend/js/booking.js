// booking.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  const errorMsg = document.getElementById("error-message");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const dot1 = document.getElementById("dot-1");
  const dot2 = document.getElementById("dot-2");

  let currentStep = 1;

  // Check if flight is selected
  const selectedFlightData = JSON.parse(localStorage.getItem('selectedFlight'));
  if (!selectedFlightData) {
    alert('No flight selected. Please search and select a flight first.');
    window.location.href = 'search.html';
    return;
  }

  // Update flag image when country code changes
  const countryCodeSelect = document.getElementById('country-code');
  const selectedFlag = document.getElementById('selected-flag');
  
  countryCodeSelect.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const flagCode = selectedOption.getAttribute('data-flag');
    selectedFlag.src = `https://flagsapi.com/${flagCode}/flat/32.png`;
  });

  // Next button - go to step 2
  nextBtn.addEventListener("click", () => {
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!firstName || !lastName || !email || !phone) {
      errorMsg.textContent = "Please fill in all required fields before proceeding.";
      errorMsg.classList.remove("hidden");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorMsg.textContent = "Please enter a valid email address.";
      errorMsg.classList.remove("hidden");
      return;
    }

    if (phone.length < 7) {
      errorMsg.textContent = "Please enter a valid phone number.";
      errorMsg.classList.remove("hidden");
      return;
    }

    errorMsg.classList.add("hidden");
    step1.classList.remove("active");
    step2.classList.add("active");
    dot1.classList.remove("active");
    dot2.classList.add("active");
    currentStep = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Previous button - go back to step 1
  prevBtn.addEventListener("click", () => {
    step2.classList.remove("active");
    step1.classList.add("active");
    dot2.classList.remove("active");
    dot1.classList.add("active");
    currentStep = 1;
    errorMsg.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const countryCode = document.getElementById("country-code").value;
    const phone = document.getElementById("phone").value.trim();
    const fullPhone = countryCode + phone;
    const dob = document.getElementById("dob").value.trim();
    const passport = document.getElementById("passport").value.trim();
    const nationality = document.getElementById("nationality").value.trim();
    const gender = document.getElementById("gender").value;
    const seat = document.getElementById("seat").value;
    const special = document.getElementById("special").value.trim();

    // Basic validation for step 2
    if (!gender) {
      errorMsg.textContent = "Please select your gender.";
      errorMsg.classList.remove("hidden");
      return;
    }

    // Create passenger information object
    const passengerInfo = {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      phone: fullPhone,
      dob,
      passport,
      nationality,
      gender,
      seatPreference: seat,
      specialRequests: special,
      timestamp: new Date().toISOString()
    };

    // Combine flight data with passenger info for payment page
    const completeBookingData = {
      flight: selectedFlightData.flight,
      searchCriteria: selectedFlightData.searchCriteria,
      passenger: passengerInfo,
      bookingDate: new Date().toISOString(),
      bookingReference: 'BK' + Date.now().toString().slice(-8)
    };

    // Save complete booking data to localStorage
    localStorage.setItem('completeBooking', JSON.stringify(completeBookingData));

    errorMsg.classList.add("hidden");
    
    // Redirect to payment page
    window.location.href = 'user-payment.html';
  });
});