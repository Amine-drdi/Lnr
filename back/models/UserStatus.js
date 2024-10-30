const mongoose = require('mongoose');

const UserStatusSchema = new mongoose.Schema({
  username: { type: String, required: true },
  status: { type: String, required: true }, // true pour en ligne, false pour hors ligne
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserStatus', UserStatusSchema);
