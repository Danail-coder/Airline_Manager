document.addEventListener("DOMContentLoaded", () => {
  const bookingData = JSON.parse(localStorage.getItem("selectedFlight"));
  const ticketCode = document.getElementById("ticket-code");

  if (!bookingData) {
    alert("No booking data found. Please go back to Booking.");
    window.location.href = "booking.html";
    return;
  }

  // Generate unique ticket number
  const ticketNum = bookingData.ticketId || Math.floor(100000 + Math.random() * 900000);
  ticketCode.textContent = `#SKY${ticketNum}`;
  bookingData.ticketId = ticketNum;

  // Fill ticket fields
  document.getElementById("passenger-name").textContent = bookingData.passenger || "—";
  document.getElementById("payment-method").textContent = bookingData.paymentMethod
    ? `Paid via ${bookingData.paymentMethod.toUpperCase()}`
    : "Payment method: —";

  document.getElementById("from").textContent = bookingData.from || "—";
  document.getElementById("to").textContent = bookingData.to || "—";
  document.getElementById("date").textContent = bookingData.date || "—";
  document.getElementById("class").textContent = bookingData.class || "—";
  document.getElementById("fare").textContent = `$${bookingData.price || "—"}`;

  // Randomize flight and seat if not set
  document.getElementById("flight-number").textContent =
    bookingData.flightNo || `SK${Math.floor(1000 + Math.random() * 9000)}`;
  document.getElementById("seat").textContent =
    bookingData.seat || `${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(1 + Math.random() * 30)}`;

  localStorage.setItem("selectedFlight", JSON.stringify(bookingData));

  // 🎨 DOWNLOAD PNG
  document.getElementById("download-png").addEventListener("click", async () => {
    const ticket = document.getElementById("ticket");
    const canvas = await html2canvas(ticket);
    const link = document.createElement("a");
    link.download = `Skylink_Ticket_${ticketNum}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // 📄 DOWNLOAD PDF
  document.getElementById("download-pdf").addEventListener("click", async () => {
    const ticket = document.getElementById("ticket");
    const canvas = await html2canvas(ticket);
    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 10, width, height);
    pdf.save(`Skylink_Ticket_${ticketNum}.pdf`);
  });
});
