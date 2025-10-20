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

  if (!searchForm) { console.error('Missing #search-form — aborting init'); return; }
  if (!flightResults) { console.error('Missing #flight-results — aborting init'); return; }

  let selectedFlight = null;
  // Persistent debug overlay (scrollable, copyable)
  const debugBox = document.createElement('div');
  debugBox.id = 'debug-box';
  debugBox.style.position = 'fixed';
  debugBox.style.right = '12px';
  debugBox.style.bottom = '12px';
  debugBox.style.width = '360px';
  debugBox.style.maxHeight = '40vh';
  debugBox.style.overflow = 'auto';
  debugBox.style.background = 'rgba(0,0,0,0.85)';
  debugBox.style.color = 'white';
  debugBox.style.padding = '8px';
  debugBox.style.borderRadius = '6px';
  debugBox.style.fontSize = '11px';
  debugBox.style.fontFamily = 'monospace';
  debugBox.style.whiteSpace = 'pre-wrap';
  debugBox.style.zIndex = 9999;
  // header + copy button
  const dbgHeader = document.createElement('div');
  dbgHeader.style.display = 'flex';
  dbgHeader.style.justifyContent = 'space-between';
  dbgHeader.style.alignItems = 'center';
  const hdrText = document.createElement('div');
  hdrText.textContent = 'debug log';
  hdrText.style.fontWeight = '600';
  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copy';
  copyBtn.style.marginLeft = '8px';
  copyBtn.style.fontSize = '11px';
  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(logContainer.innerText);
      copyBtn.textContent = 'Copied';
      setTimeout(() => copyBtn.textContent = 'Copy', 1500);
    } catch (err) {
      console.error('copy failed', err);
    }
  };
  dbgHeader.appendChild(hdrText);
  dbgHeader.appendChild(copyBtn);
  debugBox.appendChild(dbgHeader);
  // log container
  const logContainer = document.createElement('div');
  logContainer.id = 'debug-log';
  logContainer.style.marginTop = '6px';
  debugBox.appendChild(logContainer);
  document.body.appendChild(debugBox);

  function appendDebug(msg) {
    const ts = new Date().toISOString();
    logContainer.innerText = `${ts} - ${msg}\n\n` + logContainer.innerText;
  }

  // Observe class changes on resultsSection so we can tell what toggles .hidden
  if (resultsSection) {
    const mo = new MutationObserver((list) => {
      for (const mut of list) {
        if (mut.attributeName === 'class') {
          appendDebug(`results.class='${resultsSection.className}'`);
          console.log('debug: results.class changed ->', resultsSection.className);
        }
      }
    });
    mo.observe(resultsSection, { attributes: true, attributeFilter: ['class'] });
  }

  // Extra: monkey-patch classList.add/remove for this element to trace callers that toggle 'hidden'
  if (resultsSection && resultsSection.classList) {
    const originalAdd = resultsSection.classList.add.bind(resultsSection.classList);
    const originalRemove = resultsSection.classList.remove.bind(resultsSection.classList);
    resultsSection.classList.add = function(...args) {
      if (args.includes('hidden')) {
        const stack = (new Error()).stack;
        appendDebug('classList.add("hidden") called on #results-section\n' + stack);
        console.warn('debug: classList.add("hidden") called on #results-section');
        console.trace();
      }
      return originalAdd(...args);
    };
    resultsSection.classList.remove = function(...args) {
      if (args.includes('hidden')) {
        const stack = (new Error()).stack;
        appendDebug('classList.remove("hidden") called on #results-section\n' + stack);
        console.warn('debug: classList.remove("hidden") called on #results-section');
        console.trace();
      }
      return originalRemove(...args);
    };
  }

  function displayFlights(flights) {
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
        bookingSection.classList.remove('hidden');
        window.scrollTo({ top: bookingSection.offsetTop, behavior: 'smooth' });
      }
    });
  }

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation(); // prevent other handlers from also running
    debugBox.textContent = 'debug: submit fired';
    console.log('[flight-ui] search submit handler fired');
    console.log('[flight-ui] search submit handler fired');
    const formData = new FormData(searchForm);
    const searchParams = Object.fromEntries(formData.entries());

    selectedFlight = null;
    if (proceedBtn) proceedBtn.disabled = true;
    if (bookingSection) bookingSection.classList.add('hidden');
    if (confirmationSection) confirmationSection.classList.add('hidden');

    if (errorMessage) errorMessage.classList.add('hidden');
    if (loader) loader.classList.remove('hidden');

    try {
      const flights = await searchFlights(searchParams);
      displayFlights(flights);
      if (resultsSection) resultsSection.classList.remove('hidden');
      if (loader) loader.classList.add('hidden');
    } catch (err) {
      if (loader) loader.classList.add('hidden');
      if (errorMessage) {
        errorMessage.textContent = err.message || 'Failed to fetch flights';
        errorMessage.classList.remove('hidden');
      }
      const fallback = mockFlights(searchParams);
      displayFlights(fallback);
      if (resultsSection) resultsSection.classList.remove('hidden');
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!selectedFlight) return;
      const formData = new FormData(bookingForm);
      const passengerDetails = Object.fromEntries(formData.entries());
      try {
        const bookingResponse = await bookFlight(selectedFlight, passengerDetails);
        if (confirmationDetails) confirmationDetails.innerHTML = `Booking confirmed`;
        if (confirmationSection) confirmationSection.classList.remove('hidden');
      } catch (err) {
        if (errorMessage) {
          errorMessage.textContent = err.message || 'Booking failed';
          errorMessage.classList.remove('hidden');
        } else {
          alert(err.message || 'Booking failed');
        }
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

