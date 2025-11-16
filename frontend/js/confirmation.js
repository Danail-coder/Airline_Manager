document.addEventListener("DOMContentLoaded", () => {
  const selectedFlight = JSON.parse(localStorage.getItem("selectedFlight"));
  const ticketDetails = document.getElementById("ticket-details");
  const ticketId = document.getElementById("ticket-id");
  const paymentMethodDisplay = document.getElementById("payment-method-display");

  if (!selectedFlight) {
    ticketDetails.innerHTML = `<p class="text-red-600 text-center">No booking data found. Please go back to booking.</p>`;
    return;
  }

  ticketId.textContent = selectedFlight.ticketId || Math.floor(100000 + Math.random() * 900000);

  ticketDetails.innerHTML = `
    <p><strong>Flight:</strong> ${selectedFlight.from} → ${selectedFlight.to}</p>
    <p><strong>Date:</strong> ${selectedFlight.date}</p>
    <p><strong>Class:</strong> ${selectedFlight.class}</p>
    <p><strong>Passenger:</strong> ${selectedFlight.passenger}</p>
    <p><strong>Email:</strong> ${selectedFlight.email || "—"}</p>
    <p><strong>Phone:</strong> ${selectedFlight.phone}</p>
    <p class="font-semibold text-blue-700 mt-2 text-lg">Total Fare: $${selectedFlight.price}</p>
  `;

  if (selectedFlight.paymentMethod) {
    paymentMethodDisplay.textContent = `Paid via: ${selectedFlight.paymentMethod.toUpperCase()}`;
  }

  // Download PDF
  document.getElementById("download-ticket").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SkyWings Ticket", 20, 20);

    doc.setFontSize(12);
    doc.text(`Ticket ID: #AERO${ticketId.textContent}`, 20, 35);
    doc.text(`Passenger: ${selectedFlight.passenger}`, 20, 45);
    doc.text(`Email: ${selectedFlight.email || "—"}`, 20, 55);
    doc.text(`Phone: ${selectedFlight.phone}`, 20, 65);
    doc.text(`Flight: ${selectedFlight.from} → ${selectedFlight.to}`, 20, 75);
    doc.text(`Date: ${selectedFlight.date}`, 20, 85);
    doc.text(`Class: ${selectedFlight.class}`, 20, 95);
    doc.text(`Total Fare: $${selectedFlight.price}`, 20, 105);
    if (selectedFlight.paymentMethod) {
      doc.text(`Payment: ${selectedFlight.paymentMethod.toUpperCase()}`, 20, 115);
    }

    doc.save(`SkyWingsTicket_${ticketId.textContent}.pdf`);
  });
});
