const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/userModel');
require("dotenv").config(); // ✅ Ensure environment variables are loaded

// ✅ Register Function
exports.register = async (req, res) => {
    console.log(`Inside register controller`);
    
    const { username, email, password, role } = req.body; // Accept role input
    console.log(username, email, password, role);

    try {
        // Check if user already exists
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" }); // 🔥 Fix: Use 409 Conflict
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new users({
            username,
            email,
            password: hashedPassword,
            role: role || "user", // Default role is "user"
        });

        await newUser.save();

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET, // ✅ Use environment variable
            { expiresIn: "1h" }
        );

        res.status(201).json({ // ✅ Use 201 Created for new resource
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            token
        });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ message: "Error registering user", error });
    }
};

// ✅ Login Function
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login Attempt:", email, password);

    try {
        const existingUser = await users.findOne({ email });

        if (!existingUser) {
            return res.status(401).json({ message: "Incorrect email or password" }); // 🔥 Use 401 Unauthorized
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect email or password" }); // 🔥 Use 401 Unauthorized
        }

        // ✅ Update last login time
        existingUser.lastLogin = new Date();
        await existingUser.save();

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET, // ✅ Secure the secret
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
                lastLogin: existingUser.lastLogin, // ✅ Include last login
            },
            token,
        });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Something went wrong", error });
    }
};

// ✅ Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const usersList = await users.find({}, 'username email role lastLogin'); // ✅ Include lastLogin
        res.status(200).json(usersList);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error });
    }
};

// ✅ Delete a User
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await users.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error });
    }
};
