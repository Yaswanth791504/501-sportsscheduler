import showAlert from "./alerts.js";

const signuForm = document.querySelector(".user-signup-form");
const signUpButton = document.querySelector(".btn-signup");

signuForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(e.target);
  const playername = e.target[0].value;
  const email = e.target[1].value;
  const password = e.target[2].value;
  const admin = e.target[3].checked;
  e.target[0].setAttribute("disabled", "disabled");
  e.target[1].setAttribute("disabled", "disabled");
  e.target[2].setAttribute("disabled", "disabled");
  signUpButton.innerHTML = "Processing...";
  signUpButton.setAttribute("disabled", "disabled");
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playername,
        email,
        password,
        role: admin ? "admin" : "player",
      }),
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    showAlert("Signup successful", "success");
    window.setTimeout(() => {
      location.href = "/login";
    }, 2000);
  } catch (error) {
    console.error(error);
    showAlert(error.message, "fail");
    e.target[0].removeAttribute("disabled");
    e.target[1].removeAttribute("disabled");
    e.target[2].removeAttribute("disabled");
    signUpButton.innerHTML = "Signup";
  }
});
