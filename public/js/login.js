import showAlert from "./alerts.js";

const loginForm = document.querySelector(".user-login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target[0].value;
  const password = e.target[1].value;
  if (!email || !password) {
    return showAlert("Please fill in all fields", "warning");
  }
  e.target[0].setAttribute("disabled", "disabled");
  e.target[1].setAttribute("disabled", "disabled");
  const loginButton = document.querySelector(".btn-login");
  loginButton.innerHTML = "Processing...";
  loginButton.setAttribute("disabled", "disabled");
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    showAlert("Login successful", "success");
    window.setTimeout(() => {
      location.href = "/dashboard";
    }, 2000);
  } catch (error) {
    showAlert(error.message, "fail");
    e.target[0].removeAttribute("disabled");
    e.target[1].removeAttribute("disabled");
    loginButton.innerHTML = "Login";
    loginButton.removeAttribute("disabled");
  }
});
