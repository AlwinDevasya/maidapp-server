const Booking = require('../models/bookingModel'); // Ensure this file exists!
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

// 🔹 Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1️⃣ Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { name, email, date, time, serviceTitle, price } = req.body;

    if (!name || !email || !date || !time || !serviceTitle || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if booking already exists to prevent duplicates
    const existingBooking = await Booking.findOne({ email, date, serviceTitle });
    if (existingBooking) {
      return res.status(400).json({ error: "Booking already exists for this service on this date." });
    }

    const newBooking = new Booking({
      name,
      email,
      date,
      time,
      serviceTitle,
      price
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful!", booking: newBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// 2️⃣ Confirm Payment (When Payment is Successful)
exports.confirmPayment = async (req, res) => {
  try {
    const { payment_id, order_id, signature } = req.body;
    const bookingId = req.params.id;

    // 🔹 Validate payment details
    if (!payment_id || !order_id || !signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // 🔹 Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + "|" + payment_id)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // 🔹 Update Booking Status to "Paid"
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "Paid" },
      { new: true }
    );

    res.status(200).json({ message: "Payment confirmed", booking: updatedBooking });

  } catch (error) {
    console.error("🔥 Payment Confirmation Error:", error);
    res.status(500).json({ error: "Failed to confirm payment" });
  }
};
