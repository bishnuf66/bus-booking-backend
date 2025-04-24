// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const Booking = require('../database/models/Booking');
const EmailService = require('../services/EmailService');

// Initialize email service
const emailService = new EmailService();

// Email validation function
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

// Book a seat
router.post('/book', async (req, res) => {
  const { seatNumber, passengerName, phoneNumber, email } = req.body;
  
  try {
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format. Please provide a valid email address.',
        success: false 
      });
    }

    // Check if seat is already booked
    const existing = await Booking.findOne({ seatNumber });
    if (existing) {
      return res.status(400).json({ 
        message: 'Seat already booked!',
        success: false 
      });
    }

    const booking = new Booking({ seatNumber, passengerName, phoneNumber, email });
    await booking.save();

    // Send confirmation email
    const emailResult = await emailService.sendBookingConfirmation({
      seatNumber,
      passengerName,
      phoneNumber,
      email
    });

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.message);
      // Still return success for booking, but log email failure
    }

    res.status(201).json({ 
      message: 'Seat booked successfully', 
      booking,
      emailSent: emailResult.success
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: err.message,
      success: false 
    });
  }
});

// Get all booked seats
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/bus-info', async (req, res) => {
  try {
    const bookedSeats = await Booking.find({}, 'seatNumber -_id'); // only get seat numbers
    const bookedSeatNumbers = bookedSeats.map(s => s.seatNumber);

    const totalSeats = 10;
    const allSeatNumbers = Array.from({ length: totalSeats }, (_, i) => i + 1);
    const availableSeats = allSeatNumbers.filter(seat => !bookedSeatNumbers.includes(seat));

    res.json({
      totalSeats,
      bookedSeats: bookedSeatNumbers,
      availableSeats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;



