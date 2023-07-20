export default class ChatsService {
	constructor(dao) {
		this.dao = dao;
	}

    getAllMessages() {
        return this.dao.getAllMessages();
    }

    addMessage(chat) {
        return this.dao.addMessage(chat);    
    }	
}