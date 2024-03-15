fetch("/api/users")
  .then((response) => response.json())
  .then((users) => {
    const userList = document.querySelector(".user-list");
    userList.innerHTML = users
      .map((user) => {
        return `
          <li>
            <strong>Nombre:</strong>
            ${user.first_name} ${user.last_name}<br />
            <strong>Correo:</strong>
            ${user.email}<br />
            <strong>Rol:</strong>
            ${user.role}<br />
            <button onclick="updateRole('${user.email}', 'admin')">Promover a Admin</button>
            <button onclick="updateRole('${user.email}', 'premium')">Promover a Premium</button>
            <button onclick="updateRole('${user.email}', 'user')">Degradar a Usuario</button>
            <button onclick="deleteUser('${user.email}')">Eliminar Usuario</button>
          </li>
        `;
      })
      .join("");
  });

  function updateRole(email, role) {
    fetch(`/api/users/${email}/update-role`, {
      method: "POST",
      body: JSON.stringify({ role }),
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "error") {
        alert(data.message);
      } else {
        location.reload();
      }
    });
  }

function deleteUser(email) {
  fetch(`/api/users/${email}/delete`, {
    method: "DELETE",
  }).then((response) => {
    location.reload();
  });
}