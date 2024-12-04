const express = require('express');
const router = express.Router();
const Energie = require('../models/Energie');

// @route POST /api/energies
// @desc Ajouter une souscription
router.post('/', async (req, res) => {
  try {
    const newEnergie = new Energie(req.body);
    const savedEnergie = await newEnergie.save();
    res.status(201).json(savedEnergie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement de la souscription." });
  }
});

// @route GET /api/energies
// @desc Récupérer toutes les souscriptions
// Récupérer toutes les souscriptions
router.get('/', async (req, res) => {
  try {
      const energies = await Energie.find();
      res.status(200).json(energies);
  } catch (error) {
      console.error('Erreur lors de la récupération des souscriptions :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des souscriptions.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedEnergie = await Energie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEnergie) {
      return res.status(404).json({ message: "Souscription non trouvée" });
    }
    res.status(200).json(updatedEnergie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la souscription" });
  }
});

module.exports = router;
