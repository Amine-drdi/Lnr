import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListeContratsComm() {
  const [contrats, setContrats] = useState([]);
  const [filteredContrats, setFilteredContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(''); // Nouveau state pour le mois

  const compagnies = ["Néoliane", "Assurema", "Alptis", "April", "Malakoff Humanis", "Cegema", "Swisslife", "Soly Azar", "Zenio"];

  useEffect(() => {
    const fetchContrats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/contrats');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des contrats');
        }
        const data = await response.json();
        setContrats(data.contrats);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContrats();

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserName(response.data.user.name);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        navigate('/');
      }
    };

    fetchProfile();
  }, []);

  // Fonction pour extraire le mois à partir d'une chaîne de date "DD/MM/YY"
  const extractMonthFromDate = (dateString) => {
    if (!dateString) {
      return null; // Si la date est undefined ou null, retourner null
    }
    const [day, month, year] = dateString.split('/'); // Séparer la chaîne par "/"
    return parseInt(month, 10); // Retourner le mois comme entier
  };

  // Filtrage selon le commercial, la recherche et le mois
  useEffect(() => {
    if (userName) {
      const filtered = contrats.filter((contrat) => {
        const isCommercialMatch =
          contrat.Commercial &&
          contrat.Commercial.toLowerCase() === userName.toLowerCase();

        const signatureMonth = extractMonthFromDate(contrat.signatureDate); // Obtenez le mois de la date de signature

        const isMonthMatch = selectedMonth
          ? signatureMonth === parseInt(selectedMonth)
          : true;

        return isCommercialMatch && isMonthMatch;
      });

      setFilteredContrats(filtered);
    }
  }, [contrats, userName, selectedMonth]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Chargement des contrats...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-blue-gray-50 rounded-lg shadow-lg">
      <h1 className="  text-3xl font-semibold text-left text-blue-gray-700 mb-6 border-b pb-4">Liste des Contrats</h1>

      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
        />
         </div>
        {/* Filtre par mois */}
        <div className="mb-4 flex space-x-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
        >
          <option value="">Tous les mois</option>
          <option value="1">Janvier</option>
          <option value="2">Février</option>
          <option value="3">Mars</option>
          <option value="4">Avril</option>
          <option value="5">Mai</option>
          <option value="6">Juin</option>
          <option value="7">Juillet</option>
          <option value="8">Août</option>
          <option value="9">Septembre</option>
          <option value="10">Octobre</option>
          <option value="11">Novembre</option>
          <option value="12">Décembre</option>
        </select>
      </div>

      <div className="overflow-x-scroll">
        <table className="min-w-[1200px] w-full bg-white border border-gray-200 rounded-lg shadow-md whitespace-nowrap">
          <thead className="bg-blue-gray-500 border-b w-full">
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">État du dossier</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date de Signature</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date d'Effet</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commercial</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Compagnie</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Montant VP/ mois</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredContrats.map((contrat) => (
              <tr key={contrat._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700">{contrat.etatDossier}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{contrat.signatureDate}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{contrat.effetDate}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{contrat.nom}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{contrat.prenom}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{contrat.Commercial}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{contrat.compagnie}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{contrat.cotisation}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{contrat.commentaire}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListeContratsComm;
