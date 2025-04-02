const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/userModel');

// ✅ Register Function
exports.register = async (req, res) => {
    console.log(`Inside register controller`);
    
    const { username, email, password, role } = req.body; // Accept role input
    console.log(username, email, password, role);

    try {
        // Check if user already exists
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(406).json({ message: "User already exists" });
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
        res.status(200).json(newUser);
    } catch (error) {
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
            return res.status(406).json({ message: "Incorrect email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(406).json({ message: "Incorrect email or password" });
        }

        // ✅ Update last login time
        existingUser.lastLogin = new Date();
        await existingUser.save();

        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },
            "secreckey",
            { expiresIn: "1h" }
        );

        console.log("Login Response:", {
            existinguser: {
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
                lastLogin: existingUser.lastLogin, // ✅ Include last login
            },
            token,
        });

        res.status(200).json({
            existinguser: {
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
                lastLogin: existingUser.lastLogin, // ✅ Send last login to frontend
            },
            token,
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
};

// ✅ Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const usersList = await users.find({}, 'username email role lastLogin'); // ✅ Include lastLogin
        res.status(200).json(usersList);
    } catch (error) {
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
        res.status(500).json({ message: "Error deleting user", error });
    }
};
