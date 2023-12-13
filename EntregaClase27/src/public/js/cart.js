const addToCart = async (button) => {
  try {
    const title = button.getAttribute("data-title");
    const price = button.getAttribute("data-price");

    console.log("Adding to cart:", { title, price });

    const amount = { quantity: 1, title, price };

    // Obtén el ID del usuario desde la sesión del servidor
    const response = await fetch("/api/auth/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const userData = await response.json();

    // Utiliza el ID del usuario para construir la URL de la solicitud al carrito
    const userId = userData.id;

    const addToCartResponse = await fetch(`/api/carts/${userId}/products`, {
      method: "PUT",
      body: JSON.stringify(amount),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!addToCartResponse.ok) {
      throw new Error(`HTTP error! Status: ${addToCartResponse.status}`);
    }

    const addToCartResult = await addToCartResponse.json();
    console.log(addToCartResult);
  } catch (error) {
    console.error(error);
  }
};
