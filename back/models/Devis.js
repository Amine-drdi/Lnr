// models/Contrat.js

const mongoose = require('mongoose');

const devisSchema = new mongoose.Schema({



  nom: String,
  prenom: String,
  telephone: String,
  email: String,
  dob: Date,
  address: String,
  profession: String,
  devisDate: String,
  cotisation: Number,
  compagnie: String,
  effetDate: String,
  formulePropose: String,
  fraisDossier: String,
  niveauPropose: String,
  apporteurAffaire: String,
  Commercial: String,
  etatDossier: String,
  commentaire:  String,
  commentaireAgent:  String,
  remarque:  String,
  retourCompagnie : String,
  suiviGestion :String ,
  ancienneMutuelle: String,
  createdAt: { type: Date, default: Date.now },
  
});

const Devis = mongoose.model('Devis', devisSchema);
module.exports = Devis;