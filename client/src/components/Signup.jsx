import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importation de useNavigate pour la redirection
import img from '../assets/signup.jpg'

const Signup = () => {
  const [role, setRole] = useState('gestionnaire'); // État pour le rôle sélectionné
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate(); // Hook de navigation pour rediriger l'utilisateur

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logique d'inscription (vérification des informations, envoi au backend, etc.)

    // Exemple de logique de redirection après inscription réussie
    if (role === 'gestionnaire') {
      navigate('/gestionnaire'); // Redirige vers le composant gestionnaire
    } else if (role === 'manager') {
      navigate('/manager'); // Redirige vers le composant manager
    } else if (role === 'commercial') {
      navigate('/commercial'); // Redirige vers le composant commercial
    }
  };

  return (
    <section className="relative py-10 bg-gray-900 sm:py-16 lg:py-24">
      <div className="absolute inset-0">
        <img
          className="object-cover w-full h-full"
          src={img}
          alt="Homme mangeant des nouilles"
        />
      </div>
      <div className="absolute inset-0 bg-gray-900/20"></div>

      <div className="relative max-w-lg px-4 py-24 mx-auto sm:px-0">
        <div className="overflow-hidden bg-white rounded-md shadow-md">
          <div className="px-4 py-6 sm:px-8 sm:py-7">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-5">
                <div>
                  <label className="text-base font-medium text-gray-900">Adresse e-mail</label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      placeholder="Entrez votre email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">Mot de passe</label>
                  <div className="mt-2.5">
                    <input
                      type="password"
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">Confirmer le mot de passe</label>
                  <div className="mt-2.5">
                    <input
                      type="password"
                      placeholder="Confirmez votre mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">Prénom</label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      placeholder="Entrez votre prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">Nom</label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      placeholder="Entrez votre nom"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">Choisir le rôle</label>
                  <div className="mt-2.5">
                    <select
                      value={role}
                      onChange={handleRoleChange}
                      className="block w-full p-4 text-black bg-white border border-gray-200 rounded-md"
                    >
                      <option value="gestionnaire">Gestionnaire</option>
                      
                    </select>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
                  >
                    S'inscrire
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
