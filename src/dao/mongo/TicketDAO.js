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

    async addTicket() {        
        return await this.model.create({});
    }
}

const ticketDAO = new TicketDAO();

export default ticketDAO;