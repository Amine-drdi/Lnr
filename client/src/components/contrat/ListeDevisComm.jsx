import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa'; // Importer l'icône de vue

function ListeDevisComm() {
  const [deviss, setDeviss] = useState([]);
  const [filteredDevis, setFilteredDeviss] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDevis, setSelectedDevis] = useState(null); // Contrat sélectionné pour le modal
  const [showModal, setShowModal] = useState(false); // Contrôle du modal
  const [newComment, setNewComment] = useState('');

  
  const navigate = useNavigate();

  const compagnies = ["Néoliane", "Assurema", "Alptis", "April", "Malakoff Humanis", "Cegema", "Swisslife", "Soly Azar", "Zenio"];

  useEffect(() => {
    const fetchdevis = async () => {
      try {
        const response = await fetch('http://51.83.69.195:5000/api/devis');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des devis');
        }
        const data = await response.json();
        setDeviss(data.devis);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchdevis();

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('http://51.83.69.195:5000/api/profile', {
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

  // Fonction pour extraire le mois d'une date sous forme de chaîne
  const extractMonthFromDateString = (dateString) => {
    if (!dateString) return null;

    const formats = [
      { regex: /(\d{4})-(\d{2})-(\d{2})/, groupIndex: 2 }, // yyyy-mm-dd
      { regex: /(\d{4})\/(\d{2})\/(\d{2})/, groupIndex: 2 }, // yyyy/mm/dd
      { regex: /(\d{2})-(\d{2})-(\d{4})/, groupIndex: 2 }, // dd-mm-yyyy (mois au milieu)
      { regex: /(\d{2})\/(\d{2})\/(\d{4})/, groupIndex: 2 }  // dd/mm/yyyy (mois au milieu)
    ];

    for (const format of formats) {
      const match = dateString.match(format.regex);
      if (match) {
        const month = parseInt(match[format.groupIndex], 10);
        if (month >= 1 && month <= 12) {
          return month; // Renvoie le mois sous forme de nombre
        }
      }
    }

    return null; // Aucun mois trouvé
  };

  useEffect(() => {
    if (userName) {
      const filtered = deviss.filter((devis) => {
        const isCommercialMatch =
          devis.Commercial &&
          devis.Commercial.toLowerCase() === userName.toLowerCase();

        const signatureMonth = extractMonthFromDateString(devis.devisDate);
        const isMonthMatch = selectedMonth
          ? signatureMonth === parseInt(selectedMonth, 10)
          : true;

        const isSearchMatch =
          searchTerm === '' ||
          (devis.nom && devis.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (devis.prenom && devis.prenom.toLowerCase().includes(searchTerm.toLowerCase()));

        return isCommercialMatch && isMonthMatch && isSearchMatch 
      });

      setFilteredDeviss(filtered);
    }
  }, [deviss, userName, selectedMonth, searchTerm]);

  const handleViewDevis = (devis) => {
    setSelectedDevis(devis); // Définir le contrat sélectionné
    setShowModal(true); // Afficher le modal
  };

  const handleUpdateComment = async () => {
    try {
      const response = await axios.put(`http://51.83.69.195:5000/api/deviscomm/${selectedDevis._id}`, {
        commentaireAgent: newComment,
      });
      if (response.status === 200) {
        // Mettre à jour l'état local avec le nouveau commentaire
        setFilteredDeviss((prev) => 
          prev.map((d) => (d._id === selectedDevis._id ? { ...d, commentaireAgent: newComment } : d))
        );
        closeModal();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Chargement des devis...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-blue-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-left text-blue-gray-700 mb-6 border-b pb-4">Liste des Devis</h1>

      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
        />
      </div>

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
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">#</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Vue</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Heure</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date du devis</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Téléphone</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">email</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date d'Effet</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Agent</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Compagnie</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Montant VP/mois</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Ancienne mutuelle</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Apporteur d'affaire</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDevis.map((devis, index) => (
              <tr key={devis._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700 text-center">{index + 1}</td>
                <td className="px-4 py-3 text-center">
                  <FaEye className="text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => handleViewDevis(devis)} />
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.nom ? devis.nom.toUpperCase() : ''}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.prenom ? devis.prenom.toUpperCase() : '' }</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.heure}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.devisDate}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.telephone}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.email}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.effetDate}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.Commercial}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.compagnie}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.cotisation}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.ancienneMutuelle}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.apporteurAffaire}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.commentaireAgent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Modal pour afficher les détails d'un contrat */}
       {showModal && selectedDevis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4 text-light-blue-700">Détails du Devis</h2>
            <p className='text-left'><strong>Nom:</strong> {selectedDevis.nom ? selectedDevis.nom.toUpperCase() : ''}</p>
            <p className='text-left'><strong>Prénom:</strong> {selectedDevis.prenom ? selectedDevis.prenom.toUpperCase() : ''}</p>
            <p className='text-left'><strong>Date du devis:</strong> {selectedDevis.heure}</p>
            <p className='text-left'><strong>Date du devis:</strong> {selectedDevis.devisDate}</p>
            <p className='text-left'><strong>Téléphone:</strong> {selectedDevis.telephone}</p>
            <p className='text-left'><strong>Email:</strong> {selectedDevis.email}</p>
            <p className='text-left'><strong>Date d'effet:</strong> {selectedDevis.effetDate}</p>
            <p className='text-left'><strong>Agent:</strong> {selectedDevis.Commercial}</p>
            <p className='text-left'><strong>Compagnie:</strong> {selectedDevis.compagnie}</p>
            <p className='text-left'><strong>Montant VP/mois:</strong> {selectedDevis.cotisation}</p>
            <p className='text-left'><strong>Ancienne mutuelle:</strong> {selectedDevis.ancienneMutuelle}</p>
            <p className='text-left'><strong>Apporteur d'affaire:</strong> {selectedDevis.apporteurAffaire}</p>
            <p className='text-left'><strong>Commentaire Agent:</strong> {selectedDevis.commentaireAgent}</p>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full h-24 border border-gray-300 rounded-md p-2 mt-4"
              placeholder="modifier commentaire"
            />


            <div className="mt-4 flex justify-end">
              <button onClick={closeModal} className="mr-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition">
                Fermer
              </button>
              <button onClick={handleUpdateComment} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeDevisComm;