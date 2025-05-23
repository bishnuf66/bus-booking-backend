// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true,
    unique: true, // Prevents double booking
  },
  passengerName: {
    type: String,
    required: true,
  },
  phoneNumber:{
      type: String,
      required: true,
  },
  email:{
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
