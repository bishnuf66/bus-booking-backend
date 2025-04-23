// server.js
const express = require('express');
const connectDB = require('./db');
const bookingRoutes = require('./routes/bookingRoutes');
const cors = require('cors');

const app = express();
const PORT = 8000;
app.use(cors());


// Middleware
app.use(express.json());

// Routes
app.use( bookingRoutes);

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
