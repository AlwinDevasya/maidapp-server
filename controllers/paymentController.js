const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config(); // ✅ Load environment variables


console.log("🔍 Inside paymentController.js");
console.log("🔍 RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID || "Not Loaded");
console.log("🔍 RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Not Loaded");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,  
    key_secret: process.env.RAZORPAY_KEY_SECRET  
});

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount) return res.status(400).json({ error: "Amount is required" });

        const options = {
            amount: amount, // 🔥 Remove * 100 if frontend sends paise
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`
        };        

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("❌ Error creating order:", error);
        res.status(500).json({ error: "Failed to create Razorpay order" });
    }
};
