import TicketsService from '../services/tickets.service.js';
import ticketDAO from '../dao/mongo/TicketDAO.js';
import cartsController from './carts.controller.js';
import productsController from './products.controller.js';

class TicketsController {
	constructor() {
		this.service = new TicketsService(ticketDAO);
	}

	async getTickets() {
		return await this.service.getTickets();
	}

	async getTicketById(tid) {
		return await this.service.getTicketById(tid);
	}

	async addTicket(cid, user) {
		let productsOk = [];
		let productsNotOk = [];
		let totalPrice = 0;

		let cart = await cartsController.getCartById(cid);
		for (const el of cart.products) {
			let prod = await productsController.getProductById(el.product._id);
			if (prod.stock - el.cant >= 0) {
				prod.stock -= el.cant;
				await productsController.updateProduct(prod._id, prod);
				await cartsController.deleteProductFromCart(el.product._id, cid)
				let prodAuxOk = {
					title: prod.title,
					cant: el.cant,
					price: prod.price
				};
				productsOk.push(prodAuxOk);
			} else {
				let prodAuxNotOk = {
					title: prod.title,
					cant: el.cant,
					stock: prod.stock,
					price: prod.price
				};
				productsNotOk.push(prodAuxNotOk);
			}
		}
		productsOk.forEach(el => {
			totalPrice += el.cant * el.price
		})

		const timestamp = Date.now().toString();
		const ticketCode = `TICKET-${timestamp}`;

		let ticket = {
			code: ticketCode,
			amount: totalPrice,
			purchaser: user.email,

		}
		ticket = await this.service.addTicket(ticket);
		await fetch(`http://localhost:8080/api/mails/ticket/${ticket._id}/`, {
			method: 'GET'
		});
		return ticket
	}
}

const ticketsController = new TicketsController();

export default ticketsController;