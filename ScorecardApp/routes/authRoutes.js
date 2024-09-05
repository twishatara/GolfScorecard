const express = require('express'); 
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// registration route 
router.post ('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) { // if the user already exists and is trying to register again
            return res.status(400).json({message: 'User already exists' });
        }

        user = new User({username, email, password});
        await user.save();

        const payload = {userId: user._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({message: 'User registered successfully'});
    }   catch (error) {
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
});

// login route 
router.post('/login', async(req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email}); 
        if (!user) {
            return res.status(400).json({message: 'Invalid Credentials'});
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid Credentials'});
        }

        const payload = {userId: user._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:'1h'});
        res.json({token});
    }   catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'}); 
    }
}); 

module.exports = router;


