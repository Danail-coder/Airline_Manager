// search.js
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');

  // Set minimum date to today
  const dateInput = document.getElementById('date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();
    const date = document.getElementById('date').value;
    const flightClass = document.getElementById('class').value;

    // Validate inputs
    if (!from || !to || !date) {
      alert('Please fill in all required fields.');
      return;
    }

    // Create search criteria object
    const searchCriteria = {
      from: from,
      to: to,
      date: date,
      class: flightClass,
      timestamp: new Date().toISOString()
    };

    // Save search criteria to localStorage
    localStorage.setItem('flightSearchCriteria', JSON.stringify(searchCriteria));

    // Redirect to results page
    window.location.href = 'results.html';
  });
});