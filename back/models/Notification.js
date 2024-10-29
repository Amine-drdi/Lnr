// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  demande: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
