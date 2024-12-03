const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String, // matricule de l'expéditeur
    required: true,
  },
  receiver: {
    type: String, // matricule du destinataire
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  fileUrl: { type: String, default: null },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
