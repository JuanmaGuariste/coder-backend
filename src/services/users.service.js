export default class ProductsService {
	constructor(dao) {
		this.dao = dao;
	}

	getAllUsers() {
		return this.dao.getAllUsers();
	}

	createUser(user) {
		return this.dao.createUser(user);
	}
	
    getUserById(id) {
		return this.dao.getUserById(id);
	}

	getUserByEmail(email) {		
		return this.dao.getUserByEmail(email);
	}
}

