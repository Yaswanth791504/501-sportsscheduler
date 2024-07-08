import showAlert from "./alerts.js";

const logoutBtn = document.querySelector(".btn-logout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/auth/logout");
      const data = await response.json();
      showAlert(data.message, "success");
      if (data.message === "Logged out") {
        window.setTimeout(() => {
          location.href = "/";
        }, 2000);
      }
    } catch (error) {
      showAlert(error.message, "fail");
    }
  });
}
