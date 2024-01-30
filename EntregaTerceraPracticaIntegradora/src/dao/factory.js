import configs from "../config/config.js";

const persistence = configs.persistence;

const managerMapping = {
  DB: {
    Products: "./dbManager/products.db.js",
    Carts: "./dbManager/carts.db.js",
    Chat: "./dbManager/chat.db.js",
    Users: "./dbManager/users.db.js",
    Tickets: "./dbManager/tickets.db.js",
  },
  File: {
    Products: "./fileManager/products.file.js",
    Carts: "./fileManager/carts.file.js",
    Chat: "./fileManager/chat.file.js",
    Users: "./fileManager/users.file.js",
    Tickets: "./fileManager/tickets.file.js",
  },
};

let CartManager;
let ProductManager;
let ChatManager;
let UserManager;
let TicketManager;

switch (persistence) {
  case "DB":
  case "File":
    console.log(`Persistence: ${persistence}`);
    const persistenceMapping = managerMapping[persistence];
    ProductManager = (await import(persistenceMapping.Products)).default;
    CartManager = (await import(persistenceMapping.Carts)).default;
    ChatManager = (await import(persistenceMapping.Chat)).default;
    UserManager = (await import(persistenceMapping.Users)).default;
    TicketManager = (await import(persistenceMapping.Tickets)).default;
    break;
  default:
    throw new Error("Tipo de persistencia no válido");
}

export { ProductManager, CartManager, ChatManager, UserManager, TicketManager };
