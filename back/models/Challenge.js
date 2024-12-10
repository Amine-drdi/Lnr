const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  value: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now }
});
const Challenge = mongoose.model('Challenge', ChallengeSchema);
module.exports = Challenge;


