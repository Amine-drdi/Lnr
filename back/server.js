const express = require('express'); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User'); 
const Contrat = require('./models/Contrat');
const Devis = require('./models/Devis');
const RDV = require('./models/RDV');
const Note = require('./models/Note');
const UserStatus = require('./models/UserStatus');
const messageRoutes = require('./routes/messages');
const ContratUpdate = require('./models/ContratUpdate') ;
const moment = require('moment');
const path = require('path');
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://lnrfinance.fr", // URL autorisée
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


// Connexion à MongoDB
mongoose.connect('mongodb://mongodb:27017/mydatabase')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Erreur de connexion à MongoDB :', error));

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  app.use('/api/messages', messageRoutes);

 // Route pour se connecter
app.post('/api/login', async (req, res) => {
  const { matricule, password } = req.body;

  try {
    // Chercher l'utilisateur dans la base de données
    const userFromDb = await User.findOne({ matricule });
    if (!userFromDb) {
      return res.status(400).json({ message: "Matricule n'existe pas." });
    }

    // Comparer le mot de passe fourni avec celui de la base de données
    const compareResult = await bcrypt.compare(password, userFromDb.password);
    if (!compareResult) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    // Générer un token JWT
    const userToken = jwt.sign({ id: userFromDb._id, role: userFromDb.role }, 'votre_secret', { expiresIn: '1h' });
    
    // Répondre avec le token et les informations utilisateur
    res.status(200).json({ token: userToken, user: userFromDb });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Route pour enregistrer un nouvel employé
app.post('/api/registerEmp', async (req, res) => {
  const { matricule, name, password, role } = req.body;

  try {
    // Vérifier si le matricule existe déjà
    const userExists = await User.findOne({ matricule });
    if (userExists) {
      return res.status(400).json({ message: 'Ce matricule est déjà utilisé' });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({
      matricule,
      name,
      password,
      role,
    });

    // Hacher le mot de passe avant d'enregistrer l'utilisateur
    await newUser.save();

    // Envoyer la réponse avec un message de succès
    res.status(201).json({ message: 'Nouvel employé ajouté avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'employé', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});
// Route pour récupérer tous les utilisateurs
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, { matricule: 1, name: 1, _id: 0 }); // Renvoyer uniquement les champs nécessaires
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});


// Récupérer les utilisateurs pour chat

app.get('/api/userschat', async (req, res) => {
  try {
    const allowedRoles = ['Direction', 'Commerciale', 'Manager', 'Gestionnaire', 'Prise'];
    const users = await User.find({ role: { $in: allowedRoles } }, 'matricule name role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Route pour récupérer les informations du gestionnaire connecté
app.get('/api/profile', async (req, res) => {
  try {
    // Vérifier si le header Authorization est bien présent
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Aucun token fourni, accès refusé.' });
    }

    // Extraire le token du header Authorization
    const token = req.headers.authorization.split(' ')[1];

    // Vérification du token JWT
    const decodedToken = jwt.verify(token, 'votre_secret');

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(decodedToken.id);

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Renvoyer les informations de l'utilisateur
    res.json({ user });
  } catch (error) {
    // Gérer les erreurs spécifiques liées à la vérification du JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide.' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Le token a expiré.' });
    }

    // Pour toutes autres erreurs
    res.status(500).json({ message: 'Erreur lors de la récupération du profil.' });
  }
});

/* Route pour récupérer les utilisateurs ayant le rôle "Manager" ou "Gestionnaire"
app.get('/api/users/managers', async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['Manager', 'Gestionnaire'] } });
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});*/

// Route pour ajouter un nouveau contrat
app.post('/api/contrats',  async (req, res) => {
  try {

    const {
      nom,
      prenom,
      telephone,
      email,
      dob,
      address,
      profession,
     signatureDate,
      cotisation,
      compagnie,
      effetDate,
      fraisEntre,
      fraisDossier,
      interetClient,
      apporteurAffaire,
      Commercial,
      commentaireAgent,
      ancienneMutuelle,
      typeResiliation,
      payement,
   
    } = req.body;

   

    const newContrat = new Contrat({
      nom,
      prenom,
      telephone,
      email,
      dob,
      address,
      profession,
      signatureDate,
      cotisation,
      compagnie,
      effetDate,
      fraisEntre,
      fraisDossier,
      interetClient,
      apporteurAffaire,
      Commercial,
      commentaireAgent,
      ancienneMutuelle,
      typeResiliation,
      payement,

    });

    await newContrat.save();
    res.status(201).json({ message: 'Contrat ajouté avec succès', contrat: newContrat });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du contrat', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});


// Route pour ajouter un nouveau Devis
app.post('/api/devis',  async (req, res) => {
  try {

    const {
      nom,
      prenom,
      telephone,
      email,
      dob,
      address,
      profession,
      devisDate,
      heure,
      cotisation,
      compagnie,
      effetDate,
      formulePropose,
      fraisDossier,
      niveauPropose,
      apporteurAffaire,
      Commercial,
      commentaireAgent,
      ancienneMutuelle,

    } = req.body;
    const newDevis = new Devis({
      nom,
      prenom,
      telephone,
      email,
      dob,
      address,
      profession,
      devisDate,
      heure,
      cotisation,
      compagnie,
      effetDate,
      formulePropose,
      fraisDossier,
      niveauPropose,
      apporteurAffaire,
      Commercial,
      commentaireAgent,
      ancienneMutuelle,
    });

    await newDevis.save();
    res.status(201).json({ message: 'Devis ajouté avec succès', devis: newDevis });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du devis', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Route pour ajouter un nouveau RDV
app.post('/api/rdvs', async (req, res) => {
  try {
    const {
      nom,
      prenom,
      telephone,
      email,
      entreprise,
      siret,
      nbrempl,
      adresse,
      codePostal,
      ville,
      formation,
      datePriseRDV,
      dateRDV,
      heureRDV,
      userName,
      role,
      rdvType,
      commentaireManager,
      commentaireAgent,
      resultatRdv,
      
    } = req.body;

    const newRDV = new RDV({
      nom,
      prenom,
      telephone,
      email,
      entreprise,
      siret,
      nbrempl,
      adresse,
      codePostal,
      ville,
      formation,
      datePriseRDV,
      dateRDV,
      heureRDV,
      userName,
      role,
      rdvType,
      commentaireManager,
      commentaireAgent,
      resultatRdv
    });

    await newRDV.save();
    res.status(201).json({ message: 'RDV ajouté avec succès', RDV: newRDV });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du RDV', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});
// Mettre à jour un devis par ID
app.put('/api/deviscomm/:id', async (req, res) => {
  const { commentaireAgent } = req.body;
  try {
    const updatedDevis = await Devis.findByIdAndUpdate(req.params.id, { commentaireAgent }, { new: true });
    if (!updatedDevis) {
      return res.status(404).json({ message: 'Devis non trouvé' });
    }
    res.json(updatedDevis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du devis' });
  }
});

// Route pour récupérer tous les contrats
app.get('/api/contrats', async (req, res) => {
  try {
    const contrats = await Contrat.find();
    res.status(200).json({ contrats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des contrats' });
  }
});
//Route pour récupérer tous les devis
app.get('/api/devis', async (req, res) => {
  try {
    const devis = await Devis.find();
    res.status(200).json({ devis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des devis' });
  }
});

// Route pour récupérer tous les RDV OPCO
app.get('/api/rdvs', async (req, res) => {
  try {
    const rdvs = await RDV.find();
    res.status(200).json({ rdvs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des contrats' });
  }
});
// Route pour récupérer les RDV OPCO Commercail Vente
app.get('/api/rdvsCommercial', async (req, res) => {
  try {
    const rdvs = await RDV.find({ rdvType: { $ne: "Siège" } }); // Exclure "Rdv Siège"
    res.status(200).json({ rdvs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des contrats' });
  }
});


// Nouvelle route pour récupérer uniquement les RDVs avec rdvType="Siège" (pour le superviseur)
app.get('/api/rdvs/siege', async (req, res) => {
  try {
    // Filtre les rendez-vous par type "Siège"
    const rdvs = await RDV.find({ rdvType: 'Siège' });
    res.json(rdvs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur : ' + error.message });
  }
});


// Route pour mettre à jour un contrat
app.put('/api/contrats/:id', async (req, res) => {
  try {
    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de contrat invalide' });
    }

    const currentContrat = await Contrat.findById(req.params.id);
    if (!currentContrat) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    const updatedContrat = await Contrat.findByIdAndUpdate(req.params.id, req.body, { new: true });

    const updatedFields = {};
    Object.keys(req.body).forEach(key => {
      if (currentContrat[key] !== req.body[key]) {
        updatedFields[key] = { old: currentContrat[key], new: req.body[key] };
      }
    });

    if (Object.keys(updatedFields).length > 0) {
      const contratUpdate = new ContratUpdate({
        contratId: req.params.id,
        modifiedBy: req.user ? req.user.name : 'Anonyme',
        updatedFields,
      });
      await contratUpdate.save();
    }

    res.status(200).json({ message: 'Contrat mis à jour avec succès', contrat: updatedContrat });
  } catch (error) {
    console.error('Erreur détaillée :', error);  // Log détaillé pour débogage
    res.status(500).json({ message: 'Erreur lors de la mise à jour du contrat' });
  }
});


// Route PUT pour mettre à jour un devis
app.put('/api/devis/:id', async (req, res) => {
  const { id } = req.params; // Récupérer l'ID du devis à mettre à jour
  const updateData = req.body; // Les nouvelles données du devis à partir de la requête

  try {
    // Trouver le devis par ID et mettre à jour avec les nouvelles données
    const updatedDevis = await Devis.findByIdAndUpdate(id, updateData, {
      new: true, // Renvoie le devis mis à jour après modification
      runValidators: true, // Appliquer les validations du modèle
    });

    if (!updatedDevis) {
      return res.status(404).json({ message: 'Devis non trouvé' });
    }

    // Répondre avec le devis mis à jour
    res.json(updatedDevis);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du devis:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour mettre à jour un RDV
app.put('/api/rdvs/:id', async (req, res) => {
  try {
    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de rendez-vous invalide' });
    }

    const currentRdv = await RDV.findById(req.params.id);
    if (!currentRdv) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    const updatedRdv = await RDV.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Rendez-vous mis à jour avec succès', rdv: updatedRdv });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du rendez-vous' });
  }
});

// Route pour supprimer un RDV 
app.delete('/api/rdvs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RDV.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send('Rendez-vous non trouvé');
    }
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).send('Erreur lors de la suppression du rendez-vous');
  }
});

// Route pour supprimer un contrat
app.delete('/api/contrats/:id', async (req, res) => {
  try {
    await Contrat.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contrat supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du contrat' });
  }
});

// route pour les alertes 
app.get('/api/contrat-updates', async (req, res) => {
  try {
    // Récupérer les mises à jour récentes des contrats (par exemple, dans les 7 derniers jours)
    const recentUpdates = await ContratUpdate.find({
      modificationDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }).populate('contratId'); // Optionnel : pour inclure les détails du contrat modifié

    res.status(200).json(recentUpdates);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des mises à jour' });
  }
});

// Route pour mettre à jour un utilisateur
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID utilisateur invalide' });
  }

  try {
    let updatedUser = req.body;

    if (updatedUser.password) {
      const salt = await bcrypt.genSalt(10);
      updatedUser.password = await bcrypt.hash(updatedUser.password, salt);
    }

    const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});


// Route pour supprimer un utilisateur
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Trouver et supprimer l'utilisateur par ID
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Récupérer les contrats ajoutés aujourd'hui et hier
app.get('/api/contrats/today', async (req, res) => {
  try {
    // Obtenir la date actuelle
    const today = new Date();
    const todayString = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    const yesterday = new Date(today.setDate(today.getDate() - 1));
    const yesterdayString = `${yesterday.getDate().toString().padStart(2, '0')}/${(yesterday.getMonth() + 1).toString().padStart(2, '0')}/${yesterday.getFullYear()}`;

    // Convertir les dates au format ISO (YYYY-MM-DD)
    const todayISO = todayString.split('/').reverse().join('-'); // Format YYYY-MM-DD
    const yesterdayISO = yesterdayString.split('/').reverse().join('-'); // Format YYYY-MM-DD

    // Compter les contrats signés aujourd'hui
    const todayCount = await Contrat.countDocuments({ signatureDate: todayString });
    // Compter les contrats signés hier
    const yesterdayCount = await Contrat.countDocuments({ signatureDate: yesterdayString });

    res.status(200).json({ todayCount, yesterdayCount });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des données' });
  }
});

  // compter les contrats ajouter aujourd'hui
app.get('/api/contrats/commercials-today', async (req, res) => {
  try {
    // Récupérer la date actuelle au format "dd/mm/yyyy"
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`; // Format "dd/mm/yyyy"

    // Récupérer les commerciaux ayant signé des contrats aujourd'hui
    const commercials = await Contrat.aggregate([
      { $match: { signatureDate: formattedDate } }, // Filtrer les contrats du jour
      { $group: { _id: '$Commercial', count: { $sum: 1 } } }, // Grouper par Commercial
      { $project: { Commercial: '$_id', count: 1, _id: 0 } } // Projeter le champ Commercial
    ]);

    res.status(200).json(commercials); // Envoyer la réponse JSON
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commerciaux' });
  }
});

// prise Today
app.get('/events/stats/today', async (req, res) => {
  try {
    const startOfToday = moment().startOf('day').toDate(); // Début de la journée
    const endOfToday = moment().endOf('day').toDate(); // Fin de la journée
    const startOfYesterday = moment().subtract(1, 'days').startOf('day').toDate(); // Début d'hier
    const endOfYesterday = moment().subtract(1, 'days').endOf('day').toDate(); // Fin d'hier

    // Nombre d'événements créés aujourd'hui
    const todayCountEvent = await Event.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });

    // Nombre d'événements créés hier
    const yesterdayCountEvent = await Event.countDocuments({
      createdAt: { $gte: startOfYesterday, $lte: endOfYesterday }
    });

    // Calcul du pourcentage de progression
    const pourcentageProgressionEvent = yesterdayCountEvent
      ? ((todayCountEvent - yesterdayCountEvent) / yesterdayCountEvent) * 100
      : 0;

    res.json({
      todayCountEvent,
      pourcentageProgressionEvent: pourcentageProgressionEvent.toFixed(2) + "%"
    });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
});

// route count rdv OPCO
app.get('/rdv/stats/today', async (req, res) => {
  try {
    // Date du jour et d'hier
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');

    // Nombre de RDV enregistrés aujourd'hui
    const todayCountRDV = await RDV.countDocuments({
      dateInsertion: { $gte: today.toDate(), $lt: moment(today).endOf('day').toDate() }
    });

    // Nombre de RDV enregistrés hier
    const yesterdayCountRDV = await RDV.countDocuments({
      dateInsertion: { $gte: yesterday.toDate(), $lt: moment(yesterday).endOf('day').toDate() }
    });

    // Calcul du pourcentage d'augmentation
    const pourcentageProgressionRDV = yesterdayCountRDV
      ? ((todayCountRDV - yesterdayCountRDV) / yesterdayCountRDV) * 100
      : 0;
   res.json({
      todayCountRDV,
      pourcentageProgressionRDV: pourcentageProgressionRDV.toFixed(2) + "%"
    });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des statistiques de RDV.' });
  }
});

// Route pour récupérer le classement des commerciaux
app.get('/api/commercials/ranking', async (req, res) => {
  try {
    const ranking = await Contrat.aggregate([
      {
        $group: {
          _id: "$Commercial",
          contratsCount: { $sum: 1 },
          totalCotisation: { $sum: "$cotisation" }
        }
      },
      {
        $project: {
          nom: "$_id",
          contratsCount: 1,
          totalCotisation: 1
        }
      },
      { $sort: { contratsCount: -1 } }
    ]);
    
    res.json(ranking);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// route pour calculer les rdv ajouté aujourd'hui 
app.get('/api/rdvs/users-today', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Début de la journée
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Fin de la journée
    // Récupérer les RDVs du jour groupés par userName
    const rdvs = await RDV.aggregate([
      { 
        $match: { 
          dateInsertion: { 
            $gte: startOfDay, 
            $lt: endOfDay 
          } 
        } 
      },
      { $group: { _id: '$userName', count: { $sum: 1 } } }, // Grouper par userName et compter les RDVs
      { $project: { userName: '$_id', count: 1, _id: 0 } } // Projeter les résultats
    ]);
    res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des RDVs' });
  }
});

// DELETE handler function (method)
const deleteDevisById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDevis = await Devis.findByIdAndDelete(id);

    if (!deletedDevis) {
      return res.status(404).json({ message: 'Devis not found' });
    }
    res.status(200).json({ message: 'Devis deleted successfully' });
  } catch (error) {
    console.error('Error deleting devis:', error);
    res.status(500).json({ message: 'An error occurred while deleting the devis' });
  }
};

// DELETE route using the separate function
app.delete('/api/devis/:id', deleteDevisById);

// Modèle d'événement
const eventSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  time: String,
  date: String,
  link: String,
  participants: Array,
  ajoutePar: String,
  createdAt: { type: Date, default: Date.now }
});
const Event = mongoose.model("Event", eventSchema);

// Routes API
app.get("/api/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post("/events", async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.json(newEvent);
});

app.put("/events/:id", async (req, res) => {
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedEvent);
});

app.delete("/events/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event deleted" });
});

// Route pour enregistrer la connectivité (en ligne / hors ligne)
app.post('/api/status', async (req, res) => {
  const { username, status } = req.body;

  const userStatus = new UserStatus({ username, status });
  await userStatus.save();
  res.status(201).send('Statut enregistré');
});

// Endpoint pour récupérer les statuts par utilisateur et par date
app.get('/api/status-history', async (req, res) => {
  try {
    const history = await UserStatus.find().sort({ timestamp: -1 });

    // Regrouper par username et date
    const groupedHistory = {};

    history.forEach(record => {
      const dateKey = record.timestamp.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' }); // GMT+1 avec heure française

      if (!groupedHistory[record.username]) {
        groupedHistory[record.username] = {};
      }

      if (!groupedHistory[record.username][dateKey]) {
        groupedHistory[record.username][dateKey] = [];
      }

      groupedHistory[record.username][dateKey].push({
        status: record.status,
        time: record.timestamp.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Paris'  // GMT+1 avec heure française
        })
      });
    });

    // Convertir l'objet en tableau pour le renvoyer
    const response = Object.keys(groupedHistory).map(username => ({
      username,
      dates: Object.keys(groupedHistory[username]).map(date => ({
        date,
        statuses: groupedHistory[username][date]
      }))
    }));

    res.json(response);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des statuts :", error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'historique des statuts" });
  }
});

// Route ajouté une note
app.post('/notes', async (req, res) => {
  try {
    const newNote = new Note(req.body);
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Route récuperer une note
app.get('/notes', async (req, res) => {
  try {
    const name = req.query.Name;
    const notes = await Note.find({ Name: name });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
  }
});

// Route supprimer une note
app.delete('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour obtenir les statistiques de cotisation mensuelle
app.get('/api/contrats/stats/monthly-cotisation', async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const getMonthlyCotisation = async (month, year) => {
      const monthlyData = await Contrat.aggregate([
        {
          $match: {
            signatureDate: { $regex: `^\\d{2}/${String(month).padStart(2, '0')}/${year}$` }
          }
        },
        {
          $group: {
            _id: null,
            totalCotisation: { $sum: "$cotisation" }
          }
        }
      ]);

      return monthlyData.length > 0 ? monthlyData[0].totalCotisation : 0;
    };

    const totalCotisationCurrentMonth = await getMonthlyCotisation(currentMonth, currentYear);
    const totalCotisationPreviousMonth = await getMonthlyCotisation(previousMonth, previousYear);
    const cotisationProgression = totalCotisationPreviousMonth
      ? ((totalCotisationCurrentMonth - totalCotisationPreviousMonth) / totalCotisationPreviousMonth) * 100
      : 0;

    res.json({
      totalCotisationCurrentMonth,
      cotisationProgression: `${cotisationProgression.toFixed(2)}%`
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques de cotisation :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des statistiques de cotisation" });
  }
});

app.get('/api/events/ranking', async (req, res) => {
  try {
    const ranking = await Event.aggregate([
      // Jointure avec la collection User pour récupérer les détails des utilisateurs
      {
        $lookup: {
          from: 'users', // Nom de la collection User
          localField: 'ajoutePar', // Champ dans Event
          foreignField: 'name', // Champ correspondant dans User
          as: 'userDetails', // Nom de l'array résultante
        },
      },
      // Filtrer les événements où le rôle de l'utilisateur est 'Prise'
      {
        $match: {
          'userDetails.role': 'Prise',
        },
      },
      // Grouper par le champ ajoutePar
      {
        $group: {
          _id: '$ajoutePar',
          count: { $sum: 1 },
        },
      },
      // Trier les résultats par le nombre d'événements ajoutés
      {
        $sort: { count: -1 },
      },
    ]);

    res.json(ranking);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des données.' });
  }
});

// Route pour obtenir le nombre de RDVs par userName
app.get('/api/rdv-count', async (req, res) => {
  try {
    const result = await RDV.aggregate([
      { $group: { _id: "$userName", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 
// Route tableau classsement commerciaux
app.get('/api/classement', async (req, res) => {
  try {
    const classement = await Contrat.aggregate([
      {
        $group: {
          _id: "$Commercial",
          totalCotisation: { $sum: "$cotisation" },
          nbContrats: { $sum: 1 },
          compagnies: {
            $push: "$compagnie" // Collecte toutes les compagnies
          },
          nbContratsValides: {
            $sum: { $cond: [{ $eq: ["$etatDossier", "Validé"] }, 1, 0] },
          },
        },
      },
      {
        $addFields: {
          compagniesSignatures: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: "$compagnies" }, // Supprime les doublons
                as: "compagnie",
                in: {
                  k: "$$compagnie",
                  v: {
                    $size: {
                      $filter: {
                        input: "$compagnies",
                        as: "c",
                        cond: { $eq: ["$$c", "$$compagnie"] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $sort: { nbContrats: -1, totalCotisation: -1 } },
    ]);

    res.json(classement);
  } catch (error) {
    console.error("Erreur lors de l'obtention du classement:", error);
    res.status(500).json({ error: "Erreur lors de l'obtention du classement." });
  }
});                 


// Route pour obtenir le classement des apporteurs d'affaire
app.get('/api/classement-apporteurs', async (req, res) => {
  try {
    const classementApporteurs = await Contrat.aggregate([
      {
        $group: {
          _id: "$apporteurAffaire",  // Utilise "apporteurAffaire" pour le classement
          totalCotisation: { $sum: "$cotisation" },
          nbContrats: { $sum: 1 },
          compagnies: { $addToSet: "$compagnie" },
          nbContratsValides: {
            $sum: { $cond: [{ $eq: ["$etatDossier", "Validé"] }, 1, 0] },
          },
        },
      },
      { $sort: { nbContrats: -1, totalCotisation: -1 } }
    ]);
    res.json(classementApporteurs);
  } catch (error) {
    console.error("Erreur lors de l'obtention du classement des apporteurs d'affaire:", error);
    res.status(500).json({ error: "Erreur lors de l'obtention du classement des apporteurs d'affaire." });
  }
});

// Route pour obtenir le classement des commerciaux avec le nombre de RDVs ajoutés et les formations associées
app.get('/api/classement-rdv', async (req, res) => {
  try {
    const classementRDV = await RDV.aggregate([
      {
        $group: {
          _id: "$userName",
          nbRDVs: { $sum: 1 },
          formations: { $addToSet: "$formation" }, // Rassemble toutes les formations ajoutées par commercial
        },
      },
      { $sort: { nbRDVs: -1 } } // Trie par nombre de RDVs en ordre décroissant
    ]);
    res.json(classementRDV);
  } catch (error) {
    console.error("Erreur lors de l'obtention du classement des RDVs:", error);
    res.status(500).json({ error: "Erreur lors de l'obtention du classement des RDVs." });
  }
});

// Route pour ajouter un devis
app.post('/api/calend-devis', async (req, res) => {
  try {
    const {
      nom,
      prenom,
      telephone,
      email,
      dob,
      address,
      profession,
      devisDate,
      heure,
      cotisation,
      Commercial,
      compagnie,
      effetDate,
      formulePropose,
      fraisDossier,
      niveauPropose,
      apporteurAffaire,
      commentaireAgent,
      ancienneMutuelle
    } = req.body;

    // Créer un nouvel objet devis
    const newDevis = new Devis({
      nom,
      prenom,
      telephone,
      email,
      dob,
      address,
      profession,
      devisDate,
      heure,
      Commercial,
      cotisation,
      compagnie,
      effetDate,
      formulePropose,
      fraisDossier,
      niveauPropose,
      apporteurAffaire,
      commentaireAgent,
      ancienneMutuelle,
    });
    // Sauvegarder dans la base de données
    await newDevis.save();

    // Retourner une réponse avec succès
    res.status(201).json({ message: 'Devis ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du devis' });
  }
});

// Route pour récupérer tous les devis
app.get('/api/devis-recup', async (req, res) => {
  const { devisCommercial } = req.query;
  try {
    let devis;

    if (devisCommercial) {
      // Filtrer les devis par devisCommercial
      devis = await Devis.find({ devisCommercial });
    } else {
      // Récupérer tous les devis
      devis = await Devis.find();
    }

    res.status(200).json(devis);
  } catch (error) {
    console.error('Erreur lors de la récupération des devis :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Serveur démarré sur le port 5000' );
})