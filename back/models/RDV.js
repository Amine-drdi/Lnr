// models/RDV.js

const mongoose = require('mongoose');

const RDVSchema = new mongoose.Schema({
    rdvType:{
      type: String,
      required: true
    },
    nom: {
        type: String,
        required: true
      },
      prenom: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      telephone: {
        type: String,
        required: true
      },
      entreprise: {
        type: String,
        required: true
      },
      siret: {
        type: String,
        required: true
      },
      nbrempl: {
        type: Number,
        required: true
      },
      adresse: {
        type: String,
        required: true
      },
      codePostal: {
        type: String,
        required: true
      },
      ville: {
        type: String,
        required: true
      },
      formation: {
        type: Array,
        required: true
      },
      datePriseRDV: {
        type: String,
        required: true
      },
      dateRDV: {
        type: String,
        required: true
      },
      heureRDV: {
        type: String, 
        required: true
      },
      etatDossier : String ,
      commentaireManager : String,
      commentaireCommercial : String ,
      dateInsertion: {
        type: Date,
        default: Date.now // La date et l'heure de l'insertion sont automatiquement générées ici
      },
      userName : String ,
      role : String ,
      commentaireAgent : String ,
});

const RDV = mongoose.model('RDV', RDVSchema);
module.exports = RDV;