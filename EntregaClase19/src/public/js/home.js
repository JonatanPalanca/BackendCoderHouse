console.log("Connected");
const socket = io();

// Swal.fire({
//     title: "Saludos",
//     text: "Mensaje inicial",
//     icon: "success"
// });
// let user;
// const chatBox = document.getElementById("chatBox");
// const messagesLog=document.getElementById("messageLogs");
// //variables globales//

// Swal.fire({
//     title: "Who are you?",
//     input: "text",
//     text: "Ingrese su email.",
//     inputValidator: (value) =>{
//         return !value && "El email es requerido para ingresar al chat."
//     },
//     allowOutsideClick: false, //no deja salir haciendo click fuera
//     allowEscapeKey: false//no deja salir con escape
// }).then(result=>{
// user=result.value;
// socket.emit("authenticated",user);
// });

// chatBox.addEventListener("keyup",evt=>{
//     if(evt.key==="Enter"){
//         if (chatBox.value.trim().length>0){
//             //evita mensajes en blanco
//             socket.emit("message",{user,message:chatBox.value})
//             //en el evento message enviamos el user y el message como data.
//             chatBox.value=""; //clear del chatbox
//         }
//     }
// })

// socket.on("messageLogs",data=>{
//     let messages="";
//     data.forEach(message=>{
//     messages+=`${message.user} says: ${message.message}<br/>`
//     });
//     messagesLog.innerHTML=messages;
// })
// //el .then asigna a user lo que obtuvimos del value

const container = document.getElementById("container");

socket.on("showProducts", (data) => {
  //  formAdd.addEventListener("submit",function(e){e.preventDefault()})
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
            </ul>
        `;
  });
});
