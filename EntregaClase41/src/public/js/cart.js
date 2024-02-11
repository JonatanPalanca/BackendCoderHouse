const addToCart = (_id, cid) => {
  const amount = { quantity: 1 };

  fetch(`/api/carts/${cid}/product/${_id}`, {
    method: "PUT",
    body: JSON.stringify(amount),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((json) => console.log(json));
};
