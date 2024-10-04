const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définir le schéma utilisateur
const userSchema = new mongoose.Schema({
  matricule: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Gestionnaire', 'Manager', 'Commerciale', 'Direction'],
    default: '',
  },
 
}, {
  timestamps: true
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hachage du mot de passe avant d'enregistrer
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Passer l'erreur au middleware d'erreur
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
