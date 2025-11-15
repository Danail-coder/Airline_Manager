document.addEventListener("DOMContentLoaded", () => {
  const flightContainer = document.getElementById("flight-results");
  const searchData = JSON.parse(localStorage.getItem("searchData"));

  if (!searchData) {
    flightContainer.innerHTML = `<p class="text-center text-red-600">No search data found. Please go back and search again.</p>`;
    return;
  }

  // Example mock flight data (normally from backend)
  const flights = [
    { airline: "AeroConnect Air", time: "08:00 AM", fare: 250 },
    { airline: "SkyLink Express", time: "11:30 AM", fare: 275 },
    { airline: "BlueJet Airlines", time: "03:45 PM", fare: 300 }
  ];

  flightContainer.innerHTML = flights.map((f, index) => `
    <div class="border border-gray-300 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition">
      <div>
        <h2 class="font-semibold text-lg text-gray-800">${f.airline}</h2>
        <p class="text-gray-600">${searchData.from} → ${searchData.to}</p>
        <p class="text-sm text-gray-500">${searchData.date} | ${searchData.class}</p>
        <p class="font-bold text-blue-700 mt-1">$${f.fare}</p>
      </div>
      <button onclick="bookFlight(${index})" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
        Book Now
      </button>
    </div>
  `).join("");
});

function bookFlight(index) {
  const searchData = JSON.parse(localStorage.getItem("searchData"));
  const flights = [
    { airline: "AeroConnect Air", time: "08:00 AM", fare: 250 },
    { airline: "SkyLink Express", time: "11:30 AM", fare: 275 },
    { airline: "BlueJet Airlines", time: "03:45 PM", fare: 300 }
  ];
  const selectedFlight = flights[index];

  const flightData = {
    ...searchData,
    airline: selectedFlight.airline,
    time: selectedFlight.time,
    price: selectedFlight.fare
  };

  localStorage.setItem("selectedFlight", JSON.stringify(flightData));
  window.location.href = "booking.html";
}
