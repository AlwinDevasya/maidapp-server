const Message = require('../models/Message'); // Ensure you have a Message model

// Create a new message
exports.createMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


// ✅ Fetch all messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);  // ✅ Send messages as JSON
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};


// Delete a message
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndDelete(id);
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
