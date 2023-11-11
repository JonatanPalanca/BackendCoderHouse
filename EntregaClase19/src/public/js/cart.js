const addToCart = (button) => {
  const title = button.getAttribute("data-title");
  const price = button.getAttribute("data-price");

  console.log("Adding to cart:", { title, price });

  const amount = { quantity: 1, title, price };
  fetch(`/api/carts/6546add52e9ff353fb05df21/products`, {
    method: "PUT",
    body: JSON.stringify(amount),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((json) => console.log(json))
    .catch((error) => console.error(error));
};
