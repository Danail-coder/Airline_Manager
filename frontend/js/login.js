document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMsg = document.getElementById("error-message");
  const takeoffScreen = document.getElementById("takeoff-screen");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.querySelector('input[name="role"]:checked')?.value;

    if (!email || !password || !role) {
      errorMsg.textContent = "Please fill in all fields.";
      errorMsg.classList.remove("hidden");
      return;
    }

    const validAdmin = email === "admin@airline.com" && password === "admin123";
    const validClient = email === "client@airline.com" && password === "client123";

    if ((role === "admin" && validAdmin) || (role === "client" && validClient)) {
      // Hide error message
      errorMsg.classList.add("hidden");

      // Show takeoff animation
      takeoffScreen.classList.add("active");

      // Redirect after 3.5s
      setTimeout(() => {
        if (role === "admin") {
          window.location.href = "./admin/admin-dashboard.html";
        } else {
          window.location.href = "./search.html";
        }
      }, 3500);
    } else {
      errorMsg.textContent = "Invalid credentials. Try again.";
      errorMsg.classList.remove("hidden");
    }
  });
});
