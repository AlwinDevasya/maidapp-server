const express = require('express');
const usercontroller = require('./controllers/usercontroller');
const messageController = require('./controllers/messageController');
const paymentController = require('./controllers/paymentController')
const bookingController = require('./controllers/bookingController'); // Import booking controller

const router = new express.Router();

// User Routes
router.post('/register', usercontroller.register);
router.post('/login', usercontroller.login);
router.get('/users', usercontroller.getAllUsers);
router.delete('/users/:id', usercontroller.deleteUser);

// Message Routes
router.post('/send-message', messageController.createMessage);
router.get('/messages', messageController.getAllMessages);
router.delete('/delete-message/:id', messageController.deleteMessage);

// Booking Routes
router.post('/bookings', bookingController.createBooking);  // Create a booking
router.post('/confirm-payment/:id', bookingController.confirmPayment);  // Confirm payment

// Payment Route (Razorpay)
router.post('/create-order', paymentController.createOrder);  // Payment route

// Export router
module.exports = router;
