// models/Contrat.js

const mongoose = require('mongoose');

const contratSchema = new mongoose.Schema({


  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: String, required: true },
  address: { type: String, required: true },
  profession: { type: String, required: true },
  signatureDate: { type: String, required: true },
  vpAmount: { type: String, required: true },
  compagnie: { type: String, required: true },
  effetDate: { type: String, required: true },
  entryFee: { type: String  },
  fileFee: { type: String },
  businessIntroducer: {type: String , required: true},
  clientInterest: { type: String },
  état_dossier: { type: String },
  commentaire: { type: String},

  status: { type: String, default: 'pending' }, // Le statut du contrat
  createdAt: { type: Date, default: Date.now },


});

const Contrat = mongoose.model('Contrat', contratSchema);
module.exports = Contrat;
