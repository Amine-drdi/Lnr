// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  matricule: { type: String, required: true },    //matricule user
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
