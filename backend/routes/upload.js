const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

// Set CORS headers for all auth routes
router.use((req, res, next) => {
  
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Handle preflight requests
router.options('*', (req, res) => {
  res.sendStatus(200);
});

// Logout route
router.post('/dpr', (req, res) => {
  try {
    // In a real app, you might want to invalidate the token on the server side
    // For now, we'll just return success and let the client handle token removal
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

module.exports = router;
