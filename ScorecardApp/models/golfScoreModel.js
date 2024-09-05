
const mongoose = require('mongoose');

const golfScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  holeScores: {
    type: [Number],
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
  par: {
    type: Number,
    required: true,
  },
  bestClub: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
});

const GolfScore = mongoose.model('GolfScore', golfScoreSchema);

module.exports = GolfScore;

