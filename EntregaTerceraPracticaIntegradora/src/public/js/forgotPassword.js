const form = document.getElementById("forgotPasswordForm");
const errorMessageElement = document.getElementById("errorMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailInput = form.querySelector('input[name="email"]');
  const email = emailInput.value.trim();

  if (!email) {
    errorMessageElement.textContent =
      "Por favor, ingrese un correo electrónico.";
    return;
  }

  const result = await fetch("/api/sessions/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (result.status === 200) {
    // Redirige a la página de éxito o muestra un mensaje
    window.location.replace("/");
  } else if (result.status === 404) {
    errorMessageElement.textContent =
      "Usuario no encontrado. Por favor, verifique el correo electrónico.";
  } else {
    errorMessageElement.textContent =
      "Error al enviar la solicitud de restablecimiento de contraseña. Por favor, inténtelo de nuevo.";
  }
});
