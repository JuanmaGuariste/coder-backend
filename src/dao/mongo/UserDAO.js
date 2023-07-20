import userModel from "../models/user.model.js";

class UserDAO {
    constructor() {
        this.model = userModel;
    }

    async getAllUsers() {
        return await this.model.find();
    }  
    
    async getUserByEmail(email) {
        let user = await this.model.findOne({ email: email });
        return user;
    }

    async createUser(user) {
        let newUser = await this.model.create(user);
        return newUser;
    }

    async getUserById(id) {
        return await this.model.findById(id);
    }
}

const userDAO = new UserDAO();

export default userDAO;