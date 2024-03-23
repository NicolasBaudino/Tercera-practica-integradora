const recoveryForm = document.querySelector("#recovery-form");

const iEmail = document.querySelector("#user_email");

const alertMessage = document.querySelector("#alertMessage");
const emailSent = document.querySelector("#emailSent");

recoveryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  alertMessage.style.display = "none";

  const data = {
    email: iEmail.value,
  };

  await fetch("http://localhost:8080/api/jwt/recover-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        alertMessage.classList.remove("hidden");
      } else {
        iEmail.value = "";
        emailSent.classList.remove("hidden");
      }
    })
    .catch((error) => {
      iEmail.value = "";
      alertMessage.classList.remove("hidden");
    });
});