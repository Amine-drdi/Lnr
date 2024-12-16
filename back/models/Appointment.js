const mongoose = require("mongoose");


const AppointmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  time : String,
  date: Date, // Format: yyyy-mm-dd
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Référence au modèle User
    },
  ],
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
