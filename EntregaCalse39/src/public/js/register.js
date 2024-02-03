const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};

  const responseCart = await fetch("/api/carts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (responseCart.ok) {
    const carrito = await responseCart.json();
    obj.cart = carrito.payload._id;

    data.forEach((value, key) => (obj[key] = value));

    const responseUser = await fetch("/api/users/register", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (responseUser.ok) {
      window.location.replace("/");
    } else {
      console.error("Error en el registro:", responseUser.statusText);
    }
  }
});
