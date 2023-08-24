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
        let user = await this.model.findById(id);
        return user;
    }

    async updateUser(id, user) {
        return await this.model.findByIdAndUpdate(id, user);
    }
}

const userDAO = new UserDAO();

export default userDAO;