// models/ContratUpdate.js

const mongoose = require('mongoose');

const contratUpdateSchema = new mongoose.Schema({
  contratId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contrat', required: true }, // Référence au contrat modifié

  modifiedBy: { type: String, required: true }, // Nom ou ID de l'utilisateur qui a modifié le contrat
  modificationDate: { type: Date, default: Date.now }, // Date de la modification
  updatedFields: { type: Object, required: true }, // Détails des champs modifiés
});

const ContratUpdate = mongoose.model('ContratUpdate', contratUpdateSchema);
module.exports = ContratUpdate;


