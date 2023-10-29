const realtimeProductsSocket = io("/realtimeproducts");

const agregarForm = document.getElementById("agregarForm");
const productoInput = document.getElementById("producto");
const precioInput = document.getElementById("precio");

agregarForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = productoInput.value;
  const price = parseFloat(precioInput.value);

  const nuevoProducto = {
    title: title,
    price: price,
    id: 0,
  };

  console.log("Emisión de agregarProducto con datos:", nuevoProducto);

  realtimeProductsSocket.emit("agregarProducto", JSON.stringify(nuevoProducto));

  productoInput.value = "";
  precioInput.value = "";
});

const eliminarForm = document.getElementById("eliminarForm");
const productIdInput = document.getElementById("productId");

eliminarForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const productId = productIdInput.value;

  realtimeProductsSocket.emit("eliminarProducto", productId);

  productIdInput.value = "";
});

const cont = document.getElementById("contenedorDeProductos");

realtimeProductsSocket.on("mostrartodo", (data) => {
  cont.innerHTML = "";

  data.forEach((prod) => {
    cont.innerHTML += `
      <ul>
        <li>${prod.title}</li>
        <li>${prod.price}</li>
        <li>${prod.id}</li>
      </ul>
    `;
  });
});
