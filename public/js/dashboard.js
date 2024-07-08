import showAlert from "./alerts.js";
import { formateDate } from "./utils.js";

const popupClosebutton = document.querySelector(".popup-close-btn");
const overlay = document.querySelector(".overlay");
const newSessionButton = document.querySelector(".new-session-btn");
const createSessionForm = document.querySelector(".popup-form");

const closePopup = () => {
  overlay.style.display = "none";
};
popupClosebutton.addEventListener("click", closePopup);
if (newSessionButton) {
  newSessionButton.addEventListener("click", () => {
    overlay.style.display = "flex";
  });
}
const getDashboardSessions = async () => {
  try {
    const response = await fetch("/api/sessions");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    showAlert("danger", error.message);
  }
};

const displayDashboardSessions = async () => {
  try {
    const sessions = await getDashboardSessions();
    const sessionContainer = document.querySelector(".session-container-body");
    console.log(sessions);
    if (!sessions.length) {
      sessionContainer.innerHTML = "<h3>No sessions available</h3>";
      return;
    }
    sessions.forEach((session, i) => {
      const sessionCard = document.createElement("div");
      sessionCard.classList.add("session-card");
      sessionCard.innerHTML = `
          <div class="session-card-header">
            <h3>${session.title}</h3>
            <h4>${session.game}</h4>
            <div class="session-like">
              <div class="session-header-div">
                <h3>${formateDate(session.start)}</h3>
                <button class="link-button-secondary view-button" data-sessionId=${
                  session.id
                }>view</button>
              </div>
              <button class="session-like-button">
                <img
                  src="./../images/heart-empty.png"
                  class="heart-like"
                  alt="heart-empty"
                />
              </button>
            </div>
          </div>
      `;
      if (i == 0) {
        sessionContainer.innerHTML = "";
      }
      sessionContainer.appendChild(sessionCard);
    });
  } catch (error) {
    console.error(error);
  }
};

displayDashboardSessions();

createSessionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = e.target[0].value;
  const game = e.target[1].value;
  const maxPlayers = e.target[2].value;
  const location = e.target[3].value;
  const start = e.target[4].value;
  const end = e.target[5].value;
  const description = e.target[6].value;
  e.target[0].setAttribute("disabled", true);
  e.target[1].setAttribute("disabled", true);
  e.target[2].setAttribute("disabled", true);
  e.target[3].setAttribute("disabled", true);
  e.target[4].setAttribute("disabled", true);
  e.target[5].setAttribute("disabled", true);
  e.target[6].setAttribute("disabled", true);
  e.target[7].setAttribute("disabled", true);
  e.target[7].innerHTML = "Creating session...";
  try {
    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        start,
        end,
        game,
        maxPlayers,
        location,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    closePopup();
    displayDashboardSessions();
    showAlert("success", "Session created successfully");
  } catch (error) {
    showAlert("danger", error.message);
  } finally {
    e.target[0].removeAttribute("disabled");
    e.target[1].removeAttribute("disabled");
    e.target[2].removeAttribute("disabled");
    e.target[3].removeAttribute("disabled");
    e.target[4].removeAttribute("disabled");
    e.target[5].removeAttribute("disabled");
    e.target[6].removeAttribute("disabled");
    e.target[7].removeAttribute("disabled");
    e.target[7].innerHTML = "Create session";
    e.target[0].value = "";
    e.target[1].value = "";
    e.target[2].value = "";
    e.target[3].value = "";
    e.target[4].value = "";
    e.target[5].value = "";
    e.target[6].value = "";
  }
});

const navigateToSession = (sessionId) => {
  window.location.href = `/session/${sessionId}`;
};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("view-button")) {
    const sessionId = event.target.getAttribute("data-sessionId");
    navigateToSession(sessionId);
  }
});
