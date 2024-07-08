import showAlert from "./alerts.js";

const sessionId = location.pathname.split("/")[2];
const joinSessionButton = document.querySelector(".join-session");
const leaveSessionButton = document.querySelector(".leave-session");
const backButton = document.querySelector(".back-btn");
const deleteSessionButton = document.querySelector(".delete-session");

if (backButton) {
  backButton.addEventListener("click", () => {
    location.href = "/dashboard";
  });
}

if (joinSessionButton) {
  joinSessionButton.addEventListener("click", async () => {
    joinSessionButton.innerHTML = "Joining...";
    try {
      const response = await fetch(`/api/session_members/join/${sessionId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      location.href = `/session/${sessionId}`;
    } catch (error) {
      showAlert(error.message, "fail");
      joinSessionButton.innerHTML = "Join Session";
    }
  });
}

if (leaveSessionButton) {
  leaveSessionButton.addEventListener("click", async () => {
    leaveSessionButton.innerHTML = "Leaving...";
    try {
      const response = await fetch(`/api/session_members/leave/${sessionId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      location.href = `/session/${sessionId}`;
    } catch (error) {
      showAlert(error.message, "fail");
      leaveSessionButton.innerHTML = "Leave Session";
    }
  });
}

if (deleteSessionButton) {
  deleteSessionButton.addEventListener("click", async () => {
    console.log("deleteSessionButton");
    deleteSessionButton.innerHTML = "Deleting...";
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });
      console.log(response);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      location.href = "/dashboard";
      console.log("deleteSessionButton");
    } catch (error) {
      showAlert(error.message, "fail");
      deleteSessionButton.innerHTML = "Delete Session";
    }
  });
}
