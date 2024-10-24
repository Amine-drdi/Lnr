const express = require('express');  
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User'); // Importer le modèle User
const Contrat = require('./models/Contrat');
const Devis = require('./models/Devis');
const RDV = require('./models/RDV');
const ContratUpdate = require('./models/ContratUpdate') ;
const moment = require('moment');
const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect('mongodb://mongodb:27017/mydatabase')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Erreur de connexion à MongoDB :', error));






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
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
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
      nbrempl,
      adresse,
      codePostal,
      ville,
      formation,
      datePriseRDV,
      dateRDV,
      heureRDV,
      userName,
      rdvType,
      commentaireManager
    } = req.body;

    const newRDV = new RDV({
      nom,
      prenom,
      telephone,
      email,
      entreprise,
      nbrempl,
      adresse,
      codePostal,
      ville,
      formation,
      datePriseRDV,
      dateRDV,
      heureRDV,
      userName,
      rdvType,
      commentaireManager
    });

    await newRDV.save();
    res.status(201).json({ message: 'RDV ajouté avec succès', RDV: newRDV });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du RDV', error);
    res.status(500).json({ message: 'Erreur du serveur' });
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
// Route pour récupérer tous les devis
app.get('/api/devis', async (req, res) => {
  try {
    const devis = await Devis.find();
    res.status(200).json({ devis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des devis' });
  }
});
// Route pour récupérer tous les RDV
app.get('/api/rdvs', async (req, res) => {
  try {
    const rdvs = await RDV.find();
    res.status(200).json({ rdvs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des contrats' });
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
  try {
    const { id } = req.params;
    let updatedUser = req.body;

    // Si le mot de passe est modifié, hacher le nouveau mot de passe
    if (updatedUser.password) {
      const salt = await bcrypt.genSalt(10);
      updatedUser.password = await bcrypt.hash(updatedUser.password, salt);
    }

    // Trouver et mettre à jour l'utilisateur par ID
    const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Route pour récupérer tous les événements
app.get('/api/evenements', async (req, res) => {
  try {
    const evenements = await Evenement.find();
    res.json(evenements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour ajouter un événement
app.post('/api/evenements', async (req, res) => {
  try {
    const evenement = new Evenement(req.body);
    await evenement.save();
    res.status(201).json(evenement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour mettre à jour un événement
app.put('/api/evenements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const evenement = await Evenement.findByIdAndUpdate(id, req.body, { new: true });
    if (!evenement) return res.status(404).json({ message: 'Événement non trouvé' });
    res.json(evenement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour supprimer un événement
app.delete('/api/evenements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const evenement = await Evenement.findByIdAndDelete(id);
    if (!evenement) return res.status(404).json({ message: 'Événement non trouvé' });
    res.json({ message: 'Événement supprimé' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Définir le modèle pour les événements
const evenementSchema = new mongoose.Schema({
  date_evenement: String,
  titre_evenement: String,
  theme_evenement: String,
});



// Route pour récupérer tous les événements
app.get('/api/evenements', async (req, res) => {
  try {
    const evenements = await Evenement.find();
    res.json(evenements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour ajouter un événement
app.post('/api/evenements', async (req, res) => {
  try {
    const evenement = new Evenement(req.body);
    await evenement.save();
    res.status(201).json(evenement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour mettre à jour un événement
app.put('/api/evenements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const evenement = await Evenement.findByIdAndUpdate(id, req.body, { new: true });
    if (!evenement) return res.status(404).json({ message: 'Événement non trouvé' });
    res.json(evenement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour supprimer un événement
app.delete('/api/evenements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const evenement = await Evenement.findByIdAndDelete(id);
    if (!evenement) return res.status(404).json({ message: 'Événement non trouvé' });
    res.json({ message: 'Événement supprimé' });
  } catch (error) {
    res.status(400).json({ message: error.message });
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



 // afficher le chart graphique mensuel 

 app.get('/api/contrats/count-by-month', async (req, res) => {
  try {
    const contrats = await Contrat.find(); // Récupérer tous les contrats
    const contratsParMois = {};

    contrats.forEach(contrat => {
      let dateSignature = moment(contrat.signatureDate, ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"], true);      if (dateSignature.isValid()) {
        const moisAnnee = dateSignature.format('MM-YYYY'); // Formater en Mois-Année (ex: "01-2024")
        
        if (!contratsParMois[moisAnnee]) {
          contratsParMois[moisAnnee] = 0;
        }
        contratsParMois[moisAnnee]++;
      }
    });

    res.status(200).json(contratsParMois); // Envoyer la réponse avec les résultats
  } catch (error) {
    console.error('Erreur lors de la récupération des contrats par mois', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


app.get('/api/contrats/commercials-total', async (req, res) => {
  try {
    const commercials = await Contrat.aggregate([
      { $group: { _id: '$Commercial', totalContracts: { $sum: 1 } } }, // Grouper par Commercial et compter les contrats
      { $project: { Commercial: '$_id', totalContracts: 1, _id: 0 } } // Projeter les données
    ]);

    res.status(200).json(commercials); // Envoyer la réponse JSON
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des contrats' });
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


// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Serveur démarré sur le port 5000' );
})