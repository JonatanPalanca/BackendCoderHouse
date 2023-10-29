import { Messages } from "./dao/dbManagers/models/messages.model.js";

class MessagesManager {
  async saveMessage(user, message) {
    try {
      // Crea un nuevo documento de mensaje con los datos proporcionados
      const newMessage = new Messages({ user, message });

      // Guarda el mensaje en la base de datos
      await newMessage.save();
      return newMessage;
    } catch (error) {
      throw new Error(
        "Error al guardar el mensaje en la base de datos: " + error.message
      );
    }
  }

  async getAllMessages() {
    try {
      // Recupera todos los mensajes de la base de datos
      const messages = await Messages.find();
      return messages;
    } catch (error) {
      throw new Error(
        "Error al recuperar los mensajes desde la base de datos: " +
          error.message
      );
    }
  }
}

export default new MessagesManager();
