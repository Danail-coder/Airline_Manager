document.addEventListener("DOMContentLoaded", () => {

  const revenueCtx = document.getElementById("revenueChart").getContext("2d");
  const flightsCtx = document.getElementById("flightsChart").getContext("2d");

  // Revenue Chart
  new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'Revenue ($)',
        data: [45000, 50000, 48000, 52000, 55000, 60000, 62000, 61000, 65000, 70000, 72000, 75000],
        borderColor: '#1a73e8',
        backgroundColor: 'rgba(26,115,232,0.2)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true } }
    }
  });

  // Flights Per Route Chart
  new Chart(flightsCtx, {
    type: 'bar',
    data: {
      labels: ['NYC-LON','LON-PAR','NYC-PAR','NYC-TOK','LON-TOK','PAR-TOK'],
      datasets: [{
        label: 'Flights',
        data: [120, 90, 150, 80, 60, 70],
        backgroundColor: '#1a73e8'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

});
