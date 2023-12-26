import ticketModel from "./models/tickets.model.js";

export default class Ticket {
  save = async (ticket) => {
    return await ticketModel.create(ticket);
  };
}
