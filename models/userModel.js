const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 255,
    },
    token: {
        type: String,
    }

}, { timestamps: true });

exports.User = mongoose.model("Users", userSchema);
