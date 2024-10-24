import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { IoIosRefresh } from "react-icons/io";

function ListeRdvCommVente() {
  const [rdvs, setRdvs] = useState([]);
  const [filteredRdvs, setFilteredRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentaireCommercial, setCommentaireCommercial] = useState('');

  const fetchRdvs = async () => {
    setLoading(true); // Show loading before fetching
    try {
      const response = await fetch('http://51.83.69.195:5000/api/rdvs');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rendez-vous');
      }
      const data = await response.json();
      setRdvs(data.rdvs);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRdvs(); // Fetch data on component mount
  }, []);

  // Fonction pour formater la date en 'yyyy-mm-dd'
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (rdvs && Array.isArray(rdvs)) {
      const now = new Date();
      const today = formatDate(now); // Obtenir la date du jour au format 'yyyy-mm-dd'
      const currentTime = now.getHours() * 60 + now.getMinutes(); // Convertir l'heure actuelle en minutes
  
      // Filtrer les RDV par date, recherche et rdvType différent de "Téléphonique"
      const results = rdvs.filter((rdv) => {
        const rdvDate = rdv.dateRDV; // 'yyyy-mm-dd'
        const [rdvHour, rdvMinute] = rdv.heureRDV.split(':').map(Number); // Convertir l'heure de RDV en heures et minutes
        const rdvTime = rdvHour * 60 + rdvMinute; // Convertir l'heure de RDV en minutes
  
        // Comparer les dates, s'assurer que le RDV n'est pas passé et exclure les RDV "Téléphonique"
        if (rdvDate === today) {
          return (
            rdvTime >= currentTime &&
            rdv.rdvType !== 'Téléphonique' && // Exclure les RDV téléphoniques
            `${rdv.nom} ${rdv.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return (
          rdvDate > today &&
          rdv.rdvType !== 'Téléphonique' && // Exclure les RDV téléphoniques
          `${rdv.nom} ${rdv.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
  
      setFilteredRdvs(results);
    }
  }, [searchTerm, rdvs]);
  
  
  

  const closeModal = () => {
    setShowModal(false);
    setSelectedRdv(null);
  };

  const handleViewRdv = (RDV) => {
    setSelectedRdv(RDV);
    setCommentaireCommercial(RDV.commentaireCommercial || '');
    setShowModal(true);
  };

  const handleSaveComment = async () => {
    if (selectedRdv) {
      try {
        const response = await fetch(`http://51.83.69.195:5000/api/rdvs/${selectedRdv._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ commentaireCommercial }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour du commentaire');
        }

        const updatedRdv = { ...selectedRdv, commentaireCommercial };
        setRdvs((prevRdvs) =>
          prevRdvs.map((rdv) =>
            rdv._id === selectedRdv._id ? updatedRdv : rdv
          )
        );
        closeModal();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleRefresh = () => {
    fetchRdvs(); // Fetch the RDVs again when the button is clicked
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Chargement des rendez-vous...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-blue-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-left text-blue-gray-700 mb-6 border-b pb-4">Liste des Rendez-vous</h1>
      
      {/* Refresh Button */}
      <button 
        onClick={handleRefresh} 
        className="mb-4 px-4 py-2 bg-transparent text-blue-gray-700 rounded  flex items-center"
      >
        <IoIosRefresh className="mr-2" /> Actualiser
      </button>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
        />
      </div>

      <div className="overflow-x-scroll">
        <table className="min-w-[1200px] w-full bg-white border border-gray-200 rounded-lg shadow-md whitespace-nowrap">
          <thead className="bg-blue-gray-500 border-b w-full">
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider"></th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Téléphone</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Entreprise</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nombre de salariés</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Adresse</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Code Postal</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Ville</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Formation</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date Prise RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Heure RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire commercial</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRdvs.map((RDV) => (
              <tr key={RDV._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700">
                  <FaEye
                    className="text-blue-500 cursor-pointer w-4 h-4"
                    onClick={() => handleViewRdv(RDV)}
                  />
                </td>
                <td
                   className={`px-4 py-3 text-sm ${
                   RDV.rdvType === 'Physique' ? 'text-green-500' : RDV.rdvType === 'Téléphonique' ? 'text-red-500' : 'text-gray-700'
                   }`}
                >
                 {RDV.rdvType}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.nom}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.prenom}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.telephone}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.entreprise}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.adresse}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.nbrempl}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.codePostal}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.ville}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.formation}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.datePriseRDV}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.dateRDV}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.heureRDV}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.commentaireCommercial}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedRdv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-2xl text-blue-500 font-semibold mb-4">Détails du Rendez-vous</h2>
            <p className="text-left"><strong>Type Rendez-vous :</strong>
              <span className={`${selectedRdv.rdvType === 'Physique' ? 'text-green-500' : selectedRdv.rdvType === 'Téléphonique' ? 'text-red-500' : 'text-gray-700'}`}>
               {selectedRdv.rdvType}
              </span>
              </p>           
             <p className="text-left"><strong>Nom :</strong> {selectedRdv.nom}</p>
            <p className="text-left"><strong>Prénom :</strong> {selectedRdv.prenom}</p>
            <p className="text-left"><strong>Téléphone :</strong> {selectedRdv.telephone}</p>
            <p className="text-left"><strong>Email :</strong> {selectedRdv.email}</p>
            <p className="text-left"><strong>Entreprise :</strong> {selectedRdv.entreprise}</p>
            <p className="text-left"><strong>Nombre de salariés :</strong> {selectedRdv.nbrempl}</p>
            <p className="text-left"><strong>Adresse :</strong> {selectedRdv.adresse}</p>
            <p className="text-left"><strong>Code Postal :</strong> {selectedRdv.codePostal}</p>
            <p className="text-left"><strong>Ville :</strong> {selectedRdv.ville}</p>
            <p className="text-left"><strong>Formation :</strong> {selectedRdv.formation}</p>
            <p className="text-left"><strong>Date Prise RDV :</strong> {selectedRdv.datePriseRDV}</p>
            <p className="text-left"><strong>Date RDV :</strong> {selectedRdv.dateRDV}</p>
            <p className="text-left"><strong>Heure RDV :</strong> {selectedRdv.heureRDV}</p>

            <label className="block mb-2 text-left"><strong>Commentaire Commercial :</strong></label>
            <textarea
              value={commentaireCommercial}
              onChange={(e) => setCommentaireCommercial(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />

            <div className="mt-4 flex justify-between">
              <button
                onClick={handleSaveComment}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Enregistrer
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeRdvCommVente;
