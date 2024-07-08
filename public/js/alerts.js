const showAlert = (message, type) => {
  hideAlert();
  const markup = `<div class="alert alert-${type}">${message}</div>`;
  const loginMain = document.querySelector(".login-main");
  if (loginMain)
    loginMain.insertAdjacentHTML(
      "afterbegin",
      `<div class="alert-container">${markup}</div>`
    );
  window.setTimeout(hideAlert, 5000);
};

const hideAlert = () => {
  const el = document.querySelector(".alert-container");
  if (el) {
    el.classList.add("closed");
    el.parentElement.removeChild(el);
  }
};

export default showAlert;
