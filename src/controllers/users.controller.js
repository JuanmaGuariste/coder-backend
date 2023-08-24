import UsersService from '../services/users.service.js';
import userDAO from '../dao/mongo/UserDAO.js';

class UsersController {
	constructor() {
		this.service = new UsersService(userDAO);
	}
    
    async getAllUsers() {
		return await this.service.getAllUsers();
	}

	async createUser(user) {
		return await this.service.createUser(user);
	}
	
    async getUserById(id) {
		return await this.service.getUserById(id);
	}

	async getUserByEmail(email) {		
		return await this.service.getUserByEmail(email);
	}

	async updateUser(id, user) {
		return await this.service.updateUser(id, user);
	}
}

const usersController = new UsersController();

export default usersController;