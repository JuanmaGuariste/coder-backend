import UserDTO from "../dto/users.dto.js";

export default class ProductsService {
	constructor(dao) {
		this.dao = dao;
	}

	async getAllUsers() {
		return await this.dao.getAllUsers();
	}

	async createUser(user) {
		return await this.dao.createUser(user);
	}
	
    async getUserById(id) {
		if (id === "coder"){						
			return null
		}else {
			let user = await this.dao.getUserById(id);			
			return new UserDTO(user)
		}		 
	}

	async getUserByEmail(email) {		
		return await this.dao.getUserByEmail(email);
	}

	async updateUser(id, user) {
		return await this.dao.updateUser(id, user);
	}
}

