import mongoose from "mongoose";

const MessagesCollection = "Messages";

// Define el esquema para Messages
const messagesSchema = new mongoose.Schema({
  user: String, // Cambia "userId" a "user" para reflejar el correo del usuario
  message: String, // Agrega el campo "message" para el contenido del mensaje
  timestamp: Date,
});

// Crea el modelo para Messages utilizando el esquema
const Messages = mongoose.model("Messages", messagesSchema);

export { Messages };
