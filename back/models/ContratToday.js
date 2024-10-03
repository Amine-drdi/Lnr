const express = require('express');
const Contrat = require('../models/Contrat');
const router = express.Router();

router.get('/contrats/today/count', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const count = await Contrat.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });

    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;