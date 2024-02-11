import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default class TicketsFile {
  constructor(path) {
    this.path = path;
  }

  getAll = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const tickets = JSON.parse(data);
      return tickets;
    } else {
      return [];
    }
  };

  getTicketById = async (id) => {
    const tickets = await this.getAll();
    const ticket_found = tickets.find((ticket) => ticket._id === id);
    return ticket_found;
  };

  delete = async (id) => {
    const tickets = await this.getAll();
    const ticketIndex = tickets.findIndex((ticket) => ticket._id === id);
    if (ticketIndex === -1) {
      return "Ticket not found";
    }
    const ticketDeleted = tickets.splice(ticketIndex, 1);
    await fs.promises.writeFile(this.path, JSON.stringify(tickets, null, "\t"));
    return ticketDeleted;
  };

  update = async (id, ticket) => {
    const tickets = await this.getAll();
    const ticketIndex = tickets.findIndex((t) => t._id === id);
    if (ticketIndex === -1) {
      return "Ticket not found";
    }
    ticket._id = id;
    tickets[ticketIndex] = ticket;
    await fs.promises.writeFile(this.path, JSON.stringify(tickets, null, "\t"));
    return ticket;
  };

  save = async (ticket) => {
    const tickets = await this.getAll();
    const ticket_found = tickets.find((t) => t.code === ticket.code);
    if (ticket_found) {
      return "Ticket already exists";
    }
    ticket._id = uuidv4().replace(/-/g, "").substring(0, 24);
    tickets.push(ticket);
    await fs.promises.writeFile(this.path, JSON.stringify(tickets, null, "\t"));
    return ticket;
  };
}
