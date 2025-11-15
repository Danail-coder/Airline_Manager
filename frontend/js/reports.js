// Monthly Revenue Chart
const ctx1 = document.getElementById("revenueChart");
new Chart(ctx1, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [32000, 40000, 28000, 50000, 45000, 60000, 70000, 64000, 72000, 80000],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
  },
});

// Flights Per Route Chart
const ctx2 = document.getElementById("flightsChart");
new Chart(ctx2, {
  type: "bar",
  data: {
    labels: ["Accra–Kumasi", "Accra–Tamale", "Kumasi–Takoradi", "Accra–Sunyani", "Tamale–Wa"],
    datasets: [
      {
        label: "Flights",
        data: [120, 85, 60, 45, 30],
        backgroundColor: "#3b82f6",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
  },
});
