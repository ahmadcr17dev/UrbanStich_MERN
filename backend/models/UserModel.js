const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 15,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"], // Allowed roles
        default: "user" // Default role for new users
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
