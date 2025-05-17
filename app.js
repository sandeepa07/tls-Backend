require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const logger = require('./config/logger');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Database connection
require('./config/db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

// Routes
app.use('/api/auth', authRoutes);
// Add this near your other routes
app.get('/', (req, res) => {
  res.send(`
    <h1>TechLearn Solutions Backend</h1>
    <p>Server is running</p>
    <h2>Available Endpoints:</h2>
    <ul>
      <li>POST /api/auth/signup</li>
      <li>POST /api/auth/signin</li>
    </ul>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});