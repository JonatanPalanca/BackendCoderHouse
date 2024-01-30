document.addEventListener("DOMContentLoaded", () => {
  console.log("Connected");
  const socket = io();
  const container = document.getElementById("container");
  let userId;

  // Escucha el evento que proporciona el ID del usuario
  socket.on("userId", ({ userId: receivedUserId }) => {
    // Asigna el ID del usuario a la variable
    userId = receivedUserId;

    // Lógica para obtener la información del usuario con el ID
    socket.emit("getUserInfo", { userId });
  });

  // Escucha el evento que muestra los productos
  socket.on("showProducts", (data) => {
    container.innerHTML = ``;

    data.products.forEach((prod) => {
      container.innerHTML += `
          <ul>
              <li>title: ${prod.title}</li>
              <li>description: ${prod.description}</li>
              <li>code: ${prod.code}</li>
              <li>price: ${prod.price}</li>
              <li>status: ${prod.status}</li>
              <li>stock: ${prod.stock}</li>
              <li>category: ${prod.category}</li>
              <li>id: ${prod.id}</li>
              <li>owner: ${prod.owner}</li>
          </ul>
      `;
    });
  });

  // Verifica si el formulario de eliminación existe antes de asignar el evento 'submit'
  const formDeleteProduct = document.getElementById("formDelete");

  if (formDeleteProduct) {
    formDeleteProduct.addEventListener("submit", async (event) => {
      event.preventDefault();
      // Agrega lógica para manejar la eliminación del producto si es necesario
      const productIdToDelete = document.querySelector(
        "#formDelete input[name='id']"
      ).value;
      console.log(
        "Formulario de eliminación enviado para el producto con ID:",
        productIdToDelete
      );

      // Envía el evento al servidor para manejar la eliminación del producto
      socket.emit("deleteProduct", { productId: productIdToDelete });
    });
  } else {
    console.error("Elemento con ID 'formDelete' no encontrado.");
  }

  // Escucha el evento que indica que el producto ha sido eliminado exitosamente
  socket.on("productDeleted", () => {
    console.log(
      "Producto eliminado exitosamente. Actualizando la lista de productos..."
    );
    // Actualiza la lista de productos emitiendo el evento para obtener la información del usuario
    socket.emit("getUserInfo", { userId });
  });
});
