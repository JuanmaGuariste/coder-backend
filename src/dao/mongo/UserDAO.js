import userModel from "../models/user.model.js";

class UserDAO {
    constructor() {
        this.model = userModel;
    }

    async getAllUsers() {
        return await this.model.find();
    }  
    
    async getUserByEmail(email) {
        return await this.model.findOne({ email: email });
    }

    async createUser(user) {
        return await this.model.create(user);
    }

    async getUserById(id) {
        return await this.model.findById(id);
    }

}

const userDAO = new UserDAO();

export default userDAO;