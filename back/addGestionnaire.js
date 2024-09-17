const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch((error) => console.error('Erreur de connexion à MongoDB:', error));

const addUser = async () => {
  const matricule = '100';
  const name = 'med' ;
  const password = '123456789';
  const role = 'Gestionnaire';
  try {
    const existingUser = await User.findOne({ matricule });
    if (existingUser) {
      console.log('Cet utilisateur existe déjà.');
      return;
    }

   

    await User.create({matricule:matricule, name:name ,password:password , role:role})
    console.log('Utilisateur ajouté avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
  } finally {
    mongoose.connection.close();
  }
};

addUser();
