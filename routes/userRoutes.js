const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const upi_id = `${name.toLowerCase().replace(/\s/g, '')}@fastpay`;
        
        const user = new User({
            name,
            email,
            password,
            upi_id,
            balance: 1000  // Starting balance
        });

        await user.save();
        
        res.json({ 
            success: true, 
            message: 'User registered successfully',
            upi_id: user.upi_id
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.json({
            success: true,
            message: 'Login successful',
            name: user.name,
            email: user.email,
            upi_id: user.upi_id,
            balance: Number(user.balance) || 0
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
});

module.exports = router; 