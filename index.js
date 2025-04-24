const express = require('express');
const connectDB = require('./database/db');
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/AuthRoute');


const app = express();
const PORT = 8000;
app.use(cors());


// Middleware
app.use(express.json());

// Routes
app.use( bookingRoutes);
app.use(authRoutes);

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
