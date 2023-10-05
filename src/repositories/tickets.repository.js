export default class TicketsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getTickets() {
        return await this.dao.getTickets();
    }

    async getTicketById(tid) {
        return await this.dao.getTicketById(tid);
    }

    async addTicket(ticket) {
        return await this.dao.addTicket(ticket);
    }
}