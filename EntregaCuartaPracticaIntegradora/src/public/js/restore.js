const form = document.getElementById("restoreForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userEmail = form.elements.userEmail.value;
  console.log("Correo electrónico ingresado:", userEmail);

  const obj = { email: userEmail };
  const responseUser = await fetch("/api/users/restore", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (responseUser.ok) {
    window.location.replace("/restore-success");
  } else {
    window.location.replace("/failed-restore");
  }
});
