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

  // If a previous run captured traces (e.g., page reloaded and console cleared), show them now
    // No persisted debug traces in production-run; start clean.

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

  let selectedFlight = null;
  // Lightweight debug logger to DevTools console (no UI overlay)
  function appendDebug(msg) {
    const ts = new Date().toISOString();
    console.debug(`${ts} - ${msg}`);
  }

  // Targeted tracing: instrument resultsSection.classList.add to capture a stack trace
    // Normal runtime: no instrumentation.

  // Toggle to enable mock flights for development/testing
  // For smooth backend-driven flow, default to false. Set to true only for offline testing.
  const USE_MOCK_FALLBACK = false;

  function displayFlights(flights) {
    console.log('[flight-ui] displayFlights called; flights.length=', flights && flights.length);
    flightResults.innerHTML = '';
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
          <span>$${flight.price}</span>
        </div>
      `;
      div.addEventListener('click', () => selectFlight(div, flight));
      flightResults.appendChild(div);
    });
    // Make sure results section is visible when flights are displayed
    if (resultsSection) {
      resultsSection.classList.remove('hidden');
    console.log('[flight-ui] results-section visible');
      // navigate to results view
      try { navigateTo('/results'); } catch (e) { /* navigateTo may be defined later */ }

      // Short-lived guard: if some other code immediately re-adds 'hidden', remove it.
      // This observer disconnects itself after 1000ms to avoid permanent interception.
        // No guard observer needed.
    }
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
        navigateTo('/booking');
        bookingSection.querySelector('input, textarea, select')?.focus();
        window.scrollTo({ top: bookingSection.offsetTop, behavior: 'smooth' });
      }
    });
  }

  // back buttons/new search
  const backToSearch = document.getElementById('back-to-search');
  const backToSearch2 = document.getElementById('back-to-search-2');
  if (backToSearch) backToSearch.addEventListener('click', () => navigateTo('/'));
  if (backToSearch2) backToSearch2.addEventListener('click', () => {
    if (bookingForm) bookingForm.reset();
    if (confirmationDetails) confirmationDetails.innerHTML = '';
    navigateTo('/');
  });

  // Centralized search handler (called from click or submit if needed)
  async function handleSearch() {
    console.log('[flight-ui] handleSearch fired');
    const formData = new FormData(searchForm);
    const searchParams = Object.fromEntries(formData.entries());
    const findFlightsBtnEl = document.getElementById('find-flights-btn');
    selectedFlight = null;
    if (proceedBtn) proceedBtn.disabled = true;
    if (bookingSection) bookingSection.classList.add('hidden');
    if (confirmationSection) confirmationSection.classList.add('hidden');

    if (errorMessage) { errorMessage.classList.add('hidden'); errorMessage.textContent = ''; }
    if (loader) { loader.classList.remove('hidden'); loader.textContent = 'Searching flights...'; }
    if (findFlightsBtnEl) findFlightsBtnEl.disabled = true;

    // If the user checked 'Use mock data', short-circuit to local mock results immediately
    if (useMockCheckbox && useMockCheckbox.checked) {
      const fallback = mockFlights(searchParams);
      displayFlights(fallback);
      if (loader) loader.classList.add('hidden');
      if (findFlightsBtnEl) findFlightsBtnEl.disabled = false;
      // hide banner if shown
      networkBanner.style.display = 'none';
      return;
    }

    try {
      const flights = await searchFlights(searchParams);
  // hide network banner if previously shown
  networkBanner.style.display = 'none';
  console.log('[flight-ui] flights fetched, showing results');
      displayFlights(flights);
      if (loader) loader.classList.add('hidden');
      if (findFlightsBtnEl) findFlightsBtnEl.disabled = false;
    } catch (err) {
      // On network error, show banner and surface the error. Optionally use mock fallback
      appendDebug('search failed: ' + (err && err.message));
      networkBanner.style.display = 'block';
  if (loader) loader.classList.add('hidden');
  if (findFlightsBtnEl) findFlightsBtnEl.disabled = false;
      if (errorMessage) {
        // handle both Error objects and fetch response text
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

  // Bind click on the explicit Find Flights button to avoid native form submission and reloads
  const findFlightsBtn = document.getElementById('find-flights-btn');
  if (findFlightsBtn) {
    findFlightsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSearch();
    });
  }

  // Also intercept form submit (e.g., Enter key) and run the same safe handler
  // This prevents the browser from performing a native form submit/reload.
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
        // disable submit while processing
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        if (loader) { loader.classList.remove('hidden'); loader.textContent = 'Confirming booking...'; }
        // If mock mode is enabled, return a simulated booking response instead of calling the backend
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
          // small artificial delay to make UX feel natural
          await new Promise(r => setTimeout(r, 400));
        } else {
          bookingResponse = await bookFlight(selectedFlight, passengerDetails);
        }
        if (confirmationDetails) confirmationDetails.innerHTML = `Booking confirmed<br><pre>${JSON.stringify(bookingResponse, null, 2)}</pre>`;
        // navigate to confirmation page
        navigateTo('/confirmation');
        // hide booking form content
        if (bookingSection) bookingSection.classList.add('hidden');
        // hide network banner if it was visible
        networkBanner.style.display = 'none';
        if (loader) loader.classList.add('hidden');
        if (submitBtn) submitBtn.disabled = false;
      } catch (err) {
        appendDebug('booking failed: ' + (err && err.message));
        // Surface booking errors to the user (no simulation)
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

  // Basic SPA navigation helper functions
  function setActiveCrumb(route) {
    Object.values(crumbs).forEach(c => c?.classList.remove('active'));
    if (route === '/') crumbs.search?.classList.add('active');
    if (route === '/results') crumbs.results?.classList.add('active');
    if (route === '/booking') crumbs.booking?.classList.add('active');
    if (route === '/confirmation') crumbs.confirmation?.classList.add('active');
  }

  function navigateTo(route) {
    pages.forEach(p => p.classList.remove('active'));
    const target = pages.find(p => p.dataset.route === route) || pages[0];
    if (target) target.classList.add('active');
    setActiveCrumb(route);
    try { history.pushState({ route }, '', route === '/' ? '/' : route); } catch (e) { /* ignore */ }
  }

  window.addEventListener('popstate', (ev) => {
    const route = ev.state?.route || '/';
    pages.forEach(p => p.classList.remove('active'));
    const target = pages.find(p => p.dataset.route === route) || pages[0];
    target.classList.add('active');
    setActiveCrumb(route);
  });

  // initialize route
  navigateTo('/');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

