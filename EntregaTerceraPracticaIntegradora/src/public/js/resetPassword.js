const form = document.getElementById("resetPasswordForm");
const errorMessageElement = document.getElementById("errorMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const passwordInput = form.querySelector('input[name="password"]');
  const confirmPasswordInput = form.querySelector(
    'input[name="confirmPassword"]'
  );

  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!password || !confirmPassword) {
    errorMessageElement.textContent = "Por favor, complete ambos campos.";
    return;
  }

  if (password !== confirmPassword) {
    errorMessageElement.textContent = "Las contraseñas no coinciden.";
    return;
  }

  const token = window.location.pathname.split("/").pop();

  const result = await fetch(`/api/sessions/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify({ password, confirmPassword }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (result.status === 200) {
    // Redirige a la página de éxito o muestra un mensaje
    window.location.replace("/");
  } else if (result.status === 404) {
    errorMessageElement.textContent = "Enlace no válido o caducado.";
  } else {
    errorMessageElement.textContent =
      "Error al restablecer la contraseña. Por favor, inténtelo de nuevo.";
  }
});
