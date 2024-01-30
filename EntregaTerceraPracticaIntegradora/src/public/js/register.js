const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};

  try {
    const response = await fetch("/api/sessions/register", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(data)),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      window.location.replace("/");
    } else {
      console.error("Error al registrar al usuario:", response.statusText);
    }
  } catch (error) {
    console.error("Error en el registro:", error);
  }
});
