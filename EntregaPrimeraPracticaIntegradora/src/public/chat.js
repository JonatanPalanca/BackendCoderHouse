const socket = io("/chat");
const chatBox = document.getElementById("chatBox");
const messagesLog = document.getElementById("messageLogs");

Swal.fire({
  title: "Saludos",
  text: "Mensaje inicial",
  icon: "success",
});

let user;

// Función para autenticar al usuario
function authenticateUser() {
  Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator: (value) => {
      return (
        !value &&
        "Necesitas escribir un nombre de usuario para comenzar a chatear"
      );
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then((result) => {
    user = result.value;
    socket.emit("authenticated", user);
  });
}

// Manejar el evento "keyup" en el chatBox
function handleChatBoxKeyUp(evt) {
  if (evt.key === "Enter" && chatBox.value.trim().length > 0) {
    socket.emit("message", { user, message: chatBox.value });
    chatBox.value = "";
  }
}

// Actualizar el registro de mensajes en el frontend
function updateMessagesLog(data) {
  console.log("Actualizando mensajes:", data);
  let messages = "";
  messages += `${data.user} dice: ${data.message}<br/>`;
  messagesLog.innerHTML = messages;
}

// Manejar la notificación de nuevos usuarios conectados
function handleNewUserConnected(data) {
  if (user) {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmationButton: false,
      timer: 3000,
      title: `${data} se ha unido al chat`,
      icon: "success",
    });
  }
}

// Autenticar al usuario al cargar la página
authenticateUser();

// Agregar manejadores de eventos
chatBox.addEventListener("keyup", handleChatBoxKeyUp);
socket.on("newMessage", updateMessagesLog);
socket.on("newUserConnected", handleNewUserConnected);
