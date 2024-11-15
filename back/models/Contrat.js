// models/Contrat.js
const mongoose = require('mongoose');

const contratSchema = new mongoose.Schema({

  nom: String,
  prenom: String,
  telephone: String,
  email: String,
  dob: Date,
  address: String,
  profession: String,
  signatureDate: String,
  cotisation: Number,
  compagnie: String,
  effetDate: String,
  fraisEntre: String,
  fraisDossier: String,
  interetClient: String,
  apporteurAffaire: String,
  Commercial: String,
  etatDossier: String,
  commentaire:  String,
  commentaireAgent:  String,
  remarque:  String,
  retourCompagnie : String,
  suiviGestion :String ,
  typeResiliation :  String ,
  ancienneMutuelle: String,
  createdAt: { type: Date, default: Date.now },
  payement: String,
});

const Contrat = mongoose.model('Contrat', contratSchema);
module.exports = Contrat;