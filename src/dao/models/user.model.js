import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required: true,
        index: true,        
    },
    age: Number,
    password: String,
    img: String,
    rol: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    cart: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "carts",
            }
        ],
        default: "",        
    }
});

const userModel = mongoose.model("Users", userSchema);

export default userModel;