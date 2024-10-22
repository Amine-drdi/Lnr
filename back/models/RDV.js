// models/RDV.js

const mongoose = require('mongoose');

const RDVSchema = new mongoose.Schema({

    nom: {
        type: String,
        required: true
      },
      prenom: {
        type: String,
        required: true
      },
      entreprise: {
        type: String,
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
        type: String,
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
        type: String, // Optionnel, vous pouvez utiliser "Date" si vous gérez l'heure avec précision
        required: true
      },
      commentaireManager : String ,
      commentaireCommercial : String ,
      dateInsertion: {
        type: Date,
        default: Date.now // La date et l'heure de l'insertion sont automatiquement générées ici
      },
      userName : String ,
});

const RDV = mongoose.model('RDV', RDVSchema);
module.exports = RDV;