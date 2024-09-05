const express = require('express');
const mongoose = require('mongoose'); 
const dotenv = require('dotenv');
require('dotenv').config(); 

// import routes
const authRoutes = require('./routes/authRoutes');

// import middleware 
const protect = require('./middleware/authMiddleware');

// import golf score routes 
const golfScoreRoutes = require('./routes/golfScoreRoutes'); 

const app = express();

app.use(express.json());

// use authentication routes
app.use('/api/auth', authRoutes);

// use golf score routes 
app.use('/api/scores', golfScoreRoutes); // connect golf score routes

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log('Server running on port ${process.env.PORT || 5000}')))
    .catch(error => console.error(error));
