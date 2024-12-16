const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Appointment = require("../models/Appointment");

// Récupérer tous les rendez-vous
router.get("/appointments", async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});

// Ajouter un rendez-vous
router.post("/appointments", async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  res.json(appointment);
});

// Modifier un rendez-vous
router.put("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const updatedAppointment = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedAppointment);
});

// Supprimer un rendez-vous
router.delete("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  await Appointment.findByIdAndDelete(id);
  res.json({ message: "Rendez-vous supprimé" });
});


router.get("/appointments/month/:month", async (req, res) => {
  const { month } = req.params; // Format attendu: 'yyyy-mm'
  const appointments = await Appointment.find({
    date: { $regex: `^${month}` },
  });
  res.json(appointments);
});


router.get('/usersapp', async (req, res) => {
  try {
    // Filtrer les utilisateurs par rôle ("Commerciale" ou "Prise")
    const users = await User.find(
      { role: { $in: ['Commerciale', 'Prise'] } }, // Utilisation de $in pour correspondre aux rôles
      'name _id' // Récupérer uniquement le nom et l'ID
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

module.exports = router;
