const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  time: String,
  date: Date, // Format: yyyy-mm-dd
  participants: [String],
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
