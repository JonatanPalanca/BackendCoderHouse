import ticketsModel from "../dao/dbManager/models/tickets.model.js";

export default class TicketsRepository {
  constructor() {}

  saveRepository = async (ticket) => {
    const newTicket = new ticketsModel(ticket);
    const result = await newTicket.save();
    return result;
  };
}
