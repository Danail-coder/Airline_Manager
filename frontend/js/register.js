// ../js/register.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const errorMsg = document.getElementById("error-message");
  const takeoffScreen = document.getElementById("takeoff-screen");

  // Load existing users from localStorage or initialize empty array
  let users = JSON.parse(localStorage.getItem("skywingsUsers")) || [];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const role = document.querySelector('input[name="role"]:checked')?.value;
    const termsAccepted = document.getElementById("terms").checked;

    // Validation
    if (!fullname || !email || !phone || !password || !confirmPassword || !role) {
      showError("Please fill in all fields and select a role.");
      return;
    }

    if (!termsAccepted) {
      showError("Please accept Terms & Conditions.");
      return;
    }

    if (password.length < 8) {
      showError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    // Check if email already exists
    if (users.some(u => u.email === email)) {
      showError("Email is already registered.");
      return;
    }

    // Save new user
    const newUser = { fullname, email, phone, password, role };
    users.push(newUser);
    localStorage.setItem("skywingsUsers", JSON.stringify(users));

    // Show takeoff animation
    takeoffScreen.classList.add("active");

    setTimeout(() => {
      takeoffScreen.classList.remove("active");
      // Redirect clients to search page
      if (role === "client") {
        window.location.href = "./search.html";
      } else {
        window.location.href = "../admin/dashboard.html";
      }
    }, 3500);
  });

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hidden");
    setTimeout(() => errorMsg.classList.add("hidden"), 4000);
  }
});
