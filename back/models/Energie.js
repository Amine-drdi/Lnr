const mongoose = require('mongoose');

const EnergieSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  adresse: { type: String, required: true },
  codePostal: { type: String, required: true },
  ville: { type: String, required: true },
  datePriseRDV: { type: Date, required: true },
  dateRDV: { type: Date, required: true },
  heureRDV: { type: String, required: true },
  userName: { type: String },
  role: { type: String },
  rdvType: { type: String, required: true },
  commentaireAgent: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Energie', EnergieSchema);
