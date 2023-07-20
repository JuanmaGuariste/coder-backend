import ChatsService from '../services/chats.service.js';
import chatDAO from '../dao/mongo/ChatDAO.js';

class ChatsController {
	constructor() {
		this.service = new ChatsService(chatDAO);
	}
    
	getAllMessages() {
        return this.service.getAllMessages();
    }

    addMessage(chat) {
        return this.service.addMessage(chat);
    }	
}

const chatsController = new ChatsController();

export default chatsController;