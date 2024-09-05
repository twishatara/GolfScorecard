const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // get the token from the header 
            token = req.headers.authorization.split('')[1];
            // verufy the token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // get the user from the token
            next(); // continue to the next middleware or route handler
        }   catch(error) {
            console.error('Not authorized, token failed'); 
            res.status(401).json({message: 'Not authorized'});
        }
    }

    if (!token) {
        res.status(401).json({message: 'Not authorized, no token'}); 
    }
}; 

module.exports = protect; 

