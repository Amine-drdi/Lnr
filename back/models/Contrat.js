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
  cotisation: String,
  compagnie: String,
  effetDate: Date,
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
  suivieGestion :String ,
  typeResiliation :  String ,
  createdAt: { type: Date, default: Date.now },
  
});

const Contrat = mongoose.model('Contrat', contratSchema);
module.exports = Contrat;
