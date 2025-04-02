const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, default: "user" },
    lastLogin: { type: Date, default: null } // ✅ Store last login timestamp
});

module.exports = mongoose.model("User", userSchema);
