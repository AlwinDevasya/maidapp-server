const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    serviceTitle: { type: String, required: true },
    price: { type: String, required: true },
    status: { type: String, default: "Pending" }, // Default status
});

module.exports = mongoose.model('Booking', bookingSchema);
