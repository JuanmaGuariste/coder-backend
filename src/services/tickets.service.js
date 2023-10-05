import TicketsRepository from "../repositories/products.repository.js";
import ticketDAO from "../dao/mongo/TicketDAO.js";

const ticketsRepository = new TicketsRepository(ticketDAO);

export default ticketsRepository