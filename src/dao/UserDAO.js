import userModel from "./models/user.model.js";

class UserDAO {
    constructor() {
        this.userModel = userModel;
    }

    async getAllUsers() {
        return await this.userModel.find();
    }  
    
    async getUserByEmail(email) {
        return await this.userModel.findOne({ email: email });
    }

    async createUser(user) {
        return await this.userModel.create(user);
    }

}

const userDAO = new UserDAO();

export default userDAO;