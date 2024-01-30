const addToCart = (_id, cid) => {
  const amount = { quantity: 1 };
  console.log("_id: ", _id);

  fetch(`/api/carts/${cid}/product/${_id}`, {
    method: "PUT",
    body: JSON.stringify(amount),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      if (!result.ok) {
        throw new Error(`HTTP error! Status: ${result.status}`);
      }
      return result.json();
    })
    .then((json) => console.log(json))
    .catch((error) => console.error("Error:", error));

  console.log("Agregado");
};
