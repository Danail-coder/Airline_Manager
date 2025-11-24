document.addEventListener("DOMContentLoaded", () => {
  const booking = JSON.parse(localStorage.getItem("selectedFlight"));
  const passenger = JSON.parse(localStorage.getItem("passengerInfo"));
  const payment = localStorage.getItem("paymentMethod");

  if (!booking || !passenger || !payment) {
    alert("Missing booking information. Please start again.");
    window.location.href = "search.html";
    return;
  }

  // Generate ticket ID
  const ticketID = "SKY-" + Math.floor(Math.random() * 900000 + 100000);

  // Display in DOM
  document.getElementById("passenger-name").textContent = passenger.name;
  document.getElementById("passenger-email").textContent = passenger.email;

  document.getElementById("from").textContent = booking.from;
  document.getElementById("to").textContent = booking.to;
  document.getElementById("date").textContent = booking.date;
  document.getElementById("time").textContent = booking.time;

  document.getElementById("payment-method").textContent = payment;
  document.getElementById("ticket-id").textContent = ticketID;

  // Download PDF
  document.getElementById("download-ticket").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("SkyWings Ticket Confirmation", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Ticket ID: ${ticketID}`, 20, 35);
    pdf.text(`Passenger: ${passenger.name}`, 20, 45);
    pdf.text(`Email: ${passenger.email}`, 20, 55);
    pdf.text(`From: ${booking.from}`, 20, 75);
    pdf.text(`To: ${booking.to}`, 20, 85);
    pdf.text(`Date: ${booking.date}`, 20, 95);
    pdf.text(`Time: ${booking.time}`, 20, 105);
    pdf.text(`Payment Method: ${payment}`, 20, 115);

    pdf.save("SkyWings_Ticket.pdf");
  });
});
