import TicketsService from '../services/tickets.service.js';
import ticketDAO from '../dao/mongo/TicketDAO.js';
import cartsController from './carts.controller.js';

class TicketsController {
	constructor() {
		this.service = new TicketsService(ticketDAO);
	}

	async getTickets() {
		return await this.service.getTickets();
	}

	async addTicket(cid) {
        let cart = await cartsController.getCartById(cid);
        return cart
	}   
}

const ticketsController = new TicketsController();

export default ticketsController;