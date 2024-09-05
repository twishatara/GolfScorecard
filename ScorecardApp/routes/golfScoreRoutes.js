const express = require('express');
const GolfScore = require('../models/golfScoreModel');
const protect = require('../middleware/authMiddleware'); // ensure only authenticated users can access  these routes 

const router = express.Router();

// @route    POST /api/scores
// @desc     create a new golf score entry
// @access   Private
router.post('/', protect, async(req, res) => {
    const{courseName, date, holeScores, totalScore, par, bestClub, notes} = req.body

    try{
        const newScore = new GolfScore({
            userID: req.user._id, // req.user._id comes from the protect middleware 
            courseName,
            date,
            holeScores,
            totalScore,
            par,
            bestClub,
            notes,
        });

        const savedScore = await newScore.save();
        res.status(201).json(savedScore);
    }   catch (error) {
        console.error(error); 
        res.status(500).json({message: 'Server error'}); 
    }
});
 
// @route    GET /api/scores
// @desc     get all the golf scores for the logged-in user
// @access   Private
router.get('/', protect, async(req, res) => {
    try{
        const scores = await GolfScore.find({userId: req.user._id}); 
        res.json(scores);
    }   catch(error) {
        console.error(error); 
        res.status(500),json({message:'Server error'}); 
    }
});

// @route    GET /api/scores/:id
// @desc     get a single golf score entry by ID 
// @access   Private
router.get('/:id', protect, async (req, res) => {
    try {
        const score = await GolfScore.findbyID(req.params.id); 
        if (!score || score.userId.toString() !== req.user._id.toString()) {
            return res.status(400).json({message:'Score not found'}); 
        }
        res.json(score); 
    }   catch(error) {
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
}); 

// @route    PUT /api/scores/:id
// @desc     Update a golf score entry by ID
// @access   Private
router.put('/:id', protect, async(req, res) => {
    const {courseName, date, holeScores, totalScore, par, bestClub, notes} = req.body

    try {
        const score = await GolfScore.findById(req.params.id);

        if (!score || score.userId.toString() !== req.user._id.toStrng()) {
            return res.status(404).json({message:'Score not found'}); 
        }

        score.courseName = courseName || score.coursename;
        score.date = date || score.date;
        score.holeScores = holeScores || date.holeScores;
        score.totalScore = totalScore || score.totalScore; 
        score.par = par || score.par;
        score.bestClub = bestClub || score.bestClub; 
        score.notes = notes || score.notes; 
        
        const updatedScore = await score.save();
        res,json(updatedScore);
    }   catch(error) {
        console.error(error); 
        res.status(500).json({message: 'Server error'});
    }
}); 

// @route    DELETE /api/scores/:id
// @desc     delete a golf score entry by ID
// @access   Private
router.delete('/:id', protect, async( req, res) => {
    try {
        const score = await GolfScore.findbyId(req.params.id);

        if (!score || score.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({message: 'Score not found'});
        }

        await score.remove();
        res.json({message: 'Score removed'}); 
    }   catch(error) {
        console.error(error); 
        res.status(500).json({message: 'Server error'});
    }
}); 

module.exports = router;

