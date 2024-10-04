// models/Contrat.js

const mongoose = require('mongoose');

const contratSchema = new mongoose.Schema({


 /* nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: String, required: true },
  address: { type: String, required: true },
  profession: { type: String, required: true },
  signatureDate: { type: String , required: true },
  cotisation: { type: String, required: true },
  compagnie: { type: String, required: true },
  effetDate: { type: String, required: true },
  fraisEntre: { type: String  },
  fraisDossier: { type: String },
  apporteurAffaire: {type: String , required: true},
  interetClient: { type: String },
  etatDossier: { type: String },
  commentaire: { type: String},
  Commercial :{ type: String, },
  ancienneMutuelle: {type: String},
  remarque: {type : String},
  retourCompagnie : {type : String},
  suivieGestion : { type : String} ,
  typeResiliation : { type : String} ,
  file: {type : String} ,
  status: { type: String, default: 'pending' }, // Le statut du contrat
  createdAt: { type: Date, default: Date.now },*/
  nom: String,
  prenom: String,
  telephone: String,
  email: String,
  dob: Date,
  address: String,
  profession: String,
  signatureDate: Date,
  cotisation: String,
  compagnie: String,
  effetDate: Date,
  fraisEntre: String,
  fraisDossier: String,
  interetClient: String,
  apporteurAffaire: String,
  Commercial: String,
  etatDossier: String,
 
}, {
  timestamps: true // Ajoute les champs createdAt et updatedAt
  
});

const Contrat = mongoose.model('Contrat', contratSchema);
module.exports = Contrat;
