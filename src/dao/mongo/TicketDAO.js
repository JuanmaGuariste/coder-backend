import ticketModel from "../models/ticket.model.js";

class TicketDAO {
    constructor() {
        this.model = ticketModel;
    }

    async getTickets() {
        return await this.model.find();
    }

    // async getTicketById(cid) {
    //     return await this.model.findOne({ _id: cid }).populate('products.product').lean();
    // }  

    async addTicket(ticket) {        
        return await this.model.create(ticket);
    }
}

const ticketDAO = new TicketDAO();

export default ticketDAO;