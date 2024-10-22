import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import img from '../assets/bghero.png';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Importer les icônes

const Login = () => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // État pour gérer l'affichage du mot de passe
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!matricule || !password) {
      setError('Tous les champs sont requis');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', { matricule, password });
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role);

      if (user.role === 'Gestionnaire') {
        navigate('/gestionnaire');
      } else if (user.role === 'Manager') {
        navigate('/manager');
      } else if (user.role === 'Commerciale') {
        navigate('/commerciale');
      } else if (user.role === 'Direction') {
        navigate('/direction');
      } else if (user.role === 'ManagerOPCO') {
        navigate('/manager-OPCO');
      } else if (user.role === 'CommercialeOPCO') {
        navigate('/Commercial-OPCO');
      }
      else if (user.role === 'CommercialeVente') {
        navigate('/Commercial-Vente');
      }
      
      
    } catch (error) {
      console.error('Erreur lors de la connexion', error.response?.data || error.message);
      setError('Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-10 bg-gray-900 sm:py-16 lg:py-24">
      <div className="absolute inset-0">
        <img className="object-cover w-full h-full" src={img} alt="Homme mangeant des nouilles" />
      </div>
      <div className="absolute inset-0 bg-gray-900/20"></div>

      <div className="relative max-w-lg px-4 py-28 mx-auto sm:px-0">
        <div className="overflow-hidden bg-white rounded-md shadow-md">
          <div className="px-4 py-6 sm:px-8 sm:py-7">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Bon retour</h2>
              {error && (
                <div className="mt-4 text-red-600">{error}</div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-5">
                <div>
                  <label className="text-base font-medium text-gray-900">Numéro ID</label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      placeholder="Entrez votre Identifiant"
                      value={matricule}
                      onChange={(e) => setMatricule(e.target.value)}
                      className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-base font-medium text-gray-900">Mot de passe</label>
                  <div className="mt-2.5 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                    >
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className={`inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
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

export default Login;
