const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();



// Configuration de Multer pour le stockage des fichiers localement
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir); // Crée le dossier s'il n'existe pas
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ex: 123456789.jpg
  }
});

const upload = multer({ storage: storage });

// Récupérer les messages entre deux utilisateurs
router.get('/:sender/:receiver', async (req, res) => {
  const { sender, receiver } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});

// Envoyer un nouveau message
router.post('/', upload.single('file'), async (req, res) => {
  const { sender, receiver, content } = req.body;
  const file = req.file;

  // Si le contenu est vide mais qu'un fichier est présent, définir content avec "Fichier joint"
  const messageContent = content.trim() || (file ? 'Fichier joint' : null);

  if (!messageContent && !file) {
    return res.status(400).json({ error: 'Le message ou un fichier est requis' });
  }

  try {
    const newMessage = {
      sender,
      receiver,
      content: messageContent,  // Utilisation du contenu ou "Fichier joint"
      timestamp: new Date(),
      fileUrl: file ? `/uploads/${file.filename}` : null,  // URL du fichier dans le dossier 'uploads'
    };

    const message = await Message.create(newMessage);

    res.status(201).json(message);  // Envoie le message avec l'URL du fichier
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement du message:', err);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du message' });
  }
});

module.exports = router;
