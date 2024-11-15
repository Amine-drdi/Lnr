const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    time: String,
    date: String,
    link: String,
    participants: [{ name: String }],
    ajoutePar: String
  });
  const Event = mongoose.model('Event', eventSchema);
module.exports = Event;