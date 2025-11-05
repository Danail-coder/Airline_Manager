console.log("✅ script.js loaded");

// 🌍 Define your Laravel API base URL
const API_BASE_URL = "http://127.0.0.1:8000/api";

// 🔎 Search flights via Laravel API
async function searchFlights(params) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/flights?${query}`);

  if (!response.ok) {
    let bodyText = '';
    try { bodyText = await response.text(); } catch (e) { /* ignore */ }
    throw new Error(`Failed to fetch flights (status ${response.status}) ${bodyText}`);
  }

  return await response.json();
}

// ✈️ Book flight via Laravel API
async function bookFlight(flight, passenger) {
  const response = await fetch(`${API_BASE_URL}/flights/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ flight, passenger })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Booking failed");
  }

  return await response.json();
}

// Simple local mock used as a fallback when network fails
function mockFlights(params) {
  return [
    { id: 'MOCK1', airline: 'MockAir', depart: '08:00', arrive: '10:00', duration: '2h 0m', price: 120 },
    { id: 'MOCK2', airline: 'FakeFly', depart: '09:30', arrive: '12:15', duration: '2h 45m', price: 140 },
    { id: 'MOCK3', airline: 'TestWings', depart: '14:00', arrive: '16:30', duration: '2h 30m', price: 160 }
  ];
}

// Init UI and wire handlers after DOM ready
function init() {
  console.log('✅ init()');

  const searchForm = document.getElementById('search-form');
  const resultsSection = document.getElementById('results-section');
  const flightResults = document.getElementById('flight-results');
  const proceedBtn = document.getElementById('proceed-btn');
  const bookingSection = document.getElementById('booking-section');
  const bookingForm = document.getElementById('booking-form');
  const confirmationSection = document.getElementById('confirmation-section');
  const confirmationDetails = document.getElementById('confirmation-details');
  const loader = document.getElementById('loader');
  const errorMessage = document.getElementById('error-message');
  const useMockCheckbox = document.getElementById('use-mock-checkbox');
  const networkBanner = document.createElement('div');
  networkBanner.id = 'network-banner';
  networkBanner.textContent = 'Backend unreachable — showing cached/mock flights';
  document.body.appendChild(networkBanner);

  // simple SPA page and breadcrumb wiring
  const pages = Array.from(document.querySelectorAll('.page'));
  const crumbs = {
    search: document.getElementById('crumb-search'),
    results: document.getElementById('crumb-results'),
    booking: document.getElementById('crumb-booking'),
    confirmation: document.getElementById('crumb-confirmation')
  };

  if (!searchForm) { console.error('Missing #search-form — aborting init'); return; }
  if (!flightResults) { console.error('Missing #flight-results — aborting init'); return; }
  if (!resultsSection) { console.error('Missing #results-section — aborting init'); return; }
  
  console.log('[init] All sections found:', {
    search: !!document.getElementById('search-section'),
    results: !!resultsSection,
    booking: !!bookingSection,
    confirmation: !!confirmationSection
  });

  let selectedFlight = null;
  
  // Lightweight debug logger to DevTools console
  function appendDebug(msg) {
    const ts = new Date().toISOString();
    console.debug(`${ts} - ${msg}`);
  }

  // Toggle to enable mock flights for development/testing
  const USE_MOCK_FALLBACK = false;

  function displayFlights(flights) {
    console.log('[flight-ui] displayFlights called; flights.length=', flights && flights.length);
    flightResults.innerHTML = '';
    
    // Navigate to results view FIRST
    navigateTo('results');
    
    if (!flights || flights.length === 0) {
      flightResults.innerHTML = '<p>No flights found for your search.</p>';
      return;
    }
    
    flights.forEach(flight => {
      const div = document.createElement('div');
      div.className = 'flight-card';
      div.tabIndex = 0;
      div.innerHTML = `
        <div class="flight-info">
          <span><strong>${flight.airline}</strong></span>
          <span>${flight.depart} - ${flight.arrive}</span>
          <span>${flight.duration}</span>
          <span>${flight.price}</span>
        </div>
      `;
      div.addEventListener('click', () => selectFlight(div, flight));
      flightResults.appendChild(div);
    });
    
    console.log('[flight-ui] Flights displayed, results section should be visible');
  }

  function selectFlight(element, flight) {
    document.querySelectorAll('.flight-card.selected').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    selectedFlight = flight;
    if (proceedBtn) proceedBtn.disabled = false;
  }

  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      if (selectedFlight && bookingSection) {
        // navigate to booking page
        navigateTo('booking');
        bookingSection.querySelector('input, textarea, select')?.focus();
        window.scrollTo({ top: bookingSection.offsetTop, behavior: 'smooth' });
      }
    });
  }

  // back buttons/new search
  const backToSearch = document.getElementById('back-to-search');
  const backToSearch2 = document.getElementById('back-to-search-2');
  if (backToSearch) backToSearch.addEventListener('click', () => navigateTo('search'));
  if (backToSearch2) backToSearch2.addEventListener('click', () => {
    if (bookingForm) bookingForm.reset();
    if (confirmationDetails) confirmationDetails.innerHTML = '';
    navigateTo('search');
  });

  // Centralized search handler
  async function handleSearch() {
    console.log('[flight-ui] handleSearch fired');
    const formData = new FormData(searchForm);
    const searchParams = Object.fromEntries(formData.entries());
    const findFlightsBtnEl = document.getElementById('find-flights-btn');
    selectedFlight = null;
    if (proceedBtn) proceedBtn.disabled = true;

    if (errorMessage) { errorMessage.classList.add('hidden'); errorMessage.textContent = ''; }
    if (loader) { loader.classList.remove('hidden'); loader.textContent = 'Searching flights...'; }
    if (findFlightsBtnEl) findFlightsBtnEl.disabled = true;

    // If the user checked 'Use mock data', short-circuit to local mock results immediately
    if (useMockCheckbox && useMockCheckbox.checked) {
      const fallback = mockFlights(searchParams);
      displayFlights(fallback);
      if (loader) loader.classList.add('hidden');
      if (findFlightsBtnEl) findFlightsBtnEl.disabled = false;
      networkBanner.style.display = 'none';
      return;
    }

    try {
      const flights = await searchFlights(searchParams);
      networkBanner.style.display = 'none';
      console.log('[flight-ui] flights fetched, showing results');
      displayFlights(flights);
      if (loader) loader.classList.add('hidden');
      if (findFlightsBtnEl) findFlightsBtnEl.disabled = false;
    } catch (err) {
      appendDebug('search failed: ' + (err && err.message));
      networkBanner.style.display = 'block';
      if (loader) loader.classList.add('hidden');
      if (findFlightsBtnEl) findFlightsBtnEl.disabled = false;
      if (errorMessage) {
        let text = (err && err.message) || 'Failed to fetch flights';
        errorMessage.textContent = text;
        errorMessage.classList.remove('hidden');
      }
      if (USE_MOCK_FALLBACK || (useMockCheckbox && useMockCheckbox.checked)) {
        const fallback = mockFlights(searchParams);
        displayFlights(fallback);
        if (findFlightsBtnEl) findFlightsBtnEl.disabled = false;
      }
    }
  }

  // Bind click on the explicit Find Flights button
  const findFlightsBtn = document.getElementById('find-flights-btn');
  if (findFlightsBtn) {
    findFlightsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSearch();
    });
  }

  // Also intercept form submit
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    handleSearch();
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!selectedFlight) return;
      const formData = new FormData(bookingForm);
      const passengerDetails = Object.fromEntries(formData.entries());
      try {
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        if (loader) { loader.classList.remove('hidden'); loader.textContent = 'Confirming booking...'; }
        
        let bookingResponse;
        if (useMockCheckbox && useMockCheckbox.checked) {
          bookingResponse = {
            bookingReference: 'MOCK-' + Math.random().toString(36).slice(2,9).toUpperCase(),
            ticketNumber: 'TCK' + Math.floor(100000 + Math.random() * 900000),
            status: 'confirmed',
            flight: selectedFlight,
            passenger: passengerDetails,
            amount: selectedFlight?.price || 0,
            issuedAt: new Date().toISOString()
          };
          await new Promise(r => setTimeout(r, 400));
        } else {
          bookingResponse = await bookFlight(selectedFlight, passengerDetails);
        }
        
        if (confirmationDetails) confirmationDetails.innerHTML = `
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border: 1px solid #86efac;">
            <h3 style="color: #16a34a; margin-top: 0;">✅ Booking Confirmed!</h3>
            <p><strong>Booking Reference:</strong> ${bookingResponse.bookingReference}</p>
            <p><strong>Ticket Number:</strong> ${bookingResponse.ticketNumber}</p>
            <p><strong>Status:</strong> ${bookingResponse.status}</p>
            <p><strong>Passenger:</strong> ${bookingResponse.passenger.name}</p>
            <p><strong>Email:</strong> ${bookingResponse.passenger.email}</p>
            <p><strong>Amount:</strong> $${bookingResponse.amount}</p>
          </div>
        `;
        
        navigateTo('confirmation');
        networkBanner.style.display = 'none';
        if (loader) loader.classList.add('hidden');
        if (submitBtn) submitBtn.disabled = false;
      } catch (err) {
        appendDebug('booking failed: ' + (err && err.message));
        if (errorMessage) {
          errorMessage.textContent = err.message || 'Booking failed';
          errorMessage.classList.remove('hidden');
          if (loader) loader.classList.add('hidden');
          const submitBtn = bookingForm.querySelector('button[type="submit"]');
          if (submitBtn) submitBtn.disabled = false;
        } else {
          alert(err.message || 'Booking failed');
        }
      }
    });
  }

  // Basic SPA navigation helper functions (NO history.pushState)
  function setActiveCrumb(route) {
    Object.values(crumbs).forEach(c => c?.classList.remove('active'));
    if (route === 'search') crumbs.search?.classList.add('active');
    if (route === 'results') crumbs.results?.classList.add('active');
    if (route === 'booking') crumbs.booking?.classList.add('active');
    if (route === 'confirmation') crumbs.confirmation?.classList.add('active');
  }

  function navigateTo(route) {
    console.log('[navigate] navigating to:', route);
    console.log('[navigate] Pages found:', pages.length);
    
    // Remove active class from all pages
    pages.forEach(p => {
      p.classList.remove('active');
      console.log('[navigate] Removed active from:', p.id);
    });
    
    // Direct ID-based navigation (more reliable)
    let targetSection;
    if (route === 'search' || route === '/') {
      targetSection = document.getElementById('search-section');
      setActiveCrumb('search');
    } else if (route === 'results' || route === '/results') {
      targetSection = document.getElementById('results-section');
      setActiveCrumb('results');
    } else if (route === 'booking' || route === '/booking') {
      targetSection = document.getElementById('booking-section');
      setActiveCrumb('booking');
    } else if (route === 'confirmation' || route === '/confirmation') {
      targetSection = document.getElementById('confirmation-section');
      setActiveCrumb('confirmation');
    }
    
    if (targetSection) {
      // Force display by adding active class
      targetSection.classList.add('active');
      console.log('[navigate] Added active to:', targetSection.id);
      console.log('[navigate] Target classes:', targetSection.className);
      console.log('[navigate] Computed display:', window.getComputedStyle(targetSection).display);
    } else {
      console.error('[navigate] Target section not found for route:', route);
    }
  }

  // initialize route
  navigateTo('search');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}