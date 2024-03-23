const socket = io({ withCredentials: true });

document.querySelector("#send-invoce").addEventListener("click", (event) => {
  const cartId = event.target.getAttribute("data-cart-id");

  socket.emit("sendInvoce", cartId);
});

socket.on("emailSuccess", () => {
  Toastify({
    text: "Email sent successfully",
    duration: 3000,
  }).showToast();
});