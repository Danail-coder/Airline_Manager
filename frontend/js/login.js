// ../js/login.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");
  const takeoffScreen = document.getElementById("takeoff-screen");

  // Mock user data for demonstration (replace with real backend later)
  const mockUsers = [
    { email: "admin@skywings.com", password: "admin123", role: "admin" },
    { email: "client@skywings.com", password: "client123", role: "client" }
  ];

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.querySelector('input[name="role"]:checked')?.value;

    // Validate inputs
    if (!email || !password || !role) {
      showError("Please fill in all fields.");
      return;
    }

    // Check credentials
    const user = mockUsers.find(u => u.email === email && u.password === password && u.role === role);

    if (!user) {
      showError("Invalid credentials.");
      return;
    }

    // Successful login: show takeoff animation
    takeoffScreen.classList.add("active");

    // Simulate takeoff animation duration (~3.5s)
    setTimeout(() => {
      takeoffScreen.classList.remove("active");
      // Redirect based on role
      if (role === "admin") {
        window.location.href = "./admin/admin-dashboard.html";
      } else {
        window.location.href = "./search.html"; // your client dashboard
      }
    }, 3500);
  });

  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove("hidden");
    setTimeout(() => errorMessage.classList.add("hidden"), 4000);
  }
});
