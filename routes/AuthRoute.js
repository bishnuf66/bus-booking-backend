const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const { authenticateUser } = require('../middleware/auth');

// Initialize auth service with database
let authService;
router.use((req, res, next) => {
    authService = new AuthService(req.app.locals.db);
    next();
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const result = await authService.register(req.body);
        res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
});

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
    try {
        const result = await authService.getProfile(req.user.id);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
});

// Update user profile
router.put('/profile', authenticateUser, async (req, res) => {
    try {
        const result = await authService.updateProfile(req.user.id, req.body);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
});

module.exports = router;
