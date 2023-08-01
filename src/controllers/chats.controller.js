import ChatsService from '../services/chats.service.js';
import chatDAO from '../dao/mongo/ChatDAO.js';

class ChatsController {
	constructor() {
		this.service = new ChatsService(chatDAO);
	}
    
	async getAllMessages() {
        return await this.service.getAllMessages();
    }

    async addMessage(chat) {
        return await this.service.addMessage(chat);
    }	
}

const chatsController = new ChatsController();

export default chatsController;