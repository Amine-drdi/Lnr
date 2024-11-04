import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { IoIosRefresh } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa6";
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
      setFilteredRdvs(data.rdvs); // Initialiser filteredRdvs avec tous les RDVs
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRdvs(); // Fetch data on component mount
  }, []);

  useEffect(() => {
    if (rdvs && Array.isArray(rdvs)) {
      // Filtrer uniquement par le terme de recherche
      const results = rdvs.filter((rdv) =>
        `${rdv.nom} ${rdv.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
    <div className="full mx-auto p-6 bg-blue-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-left text-blue-gray-700 mb-6 border-b pb-4 ">Liste des Rendez-vous</h1>
      
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
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">#</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Type RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Entreprise</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Téléphone</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">SIRET</th>
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
            {filteredRdvs.map((RDV, index) => (
              <tr key={RDV._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700 text-center">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <FaRegCommentDots
                    className="text-blue-500 cursor-pointer w-4 h-4"
                    onClick={() => handleViewRdv(RDV)}
                  />
                </td>
                <td
                   className={`px-4 py-3 text-sm ${
                   RDV.rdvType === 'Physique' ? 'text-green-500' : RDV.rdvType === 'Téléphonique' ? 'text-blue-700' : 'text-gray-700'
                   }`}
                >
                 {RDV.rdvType}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.entreprise}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.nom}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.prenom}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.telephone}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.siret}</td>
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
      

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl font-semibold mb-4">Commentaire Commercial</h2>
            <textarea
              value={commentaireCommercial}
              onChange={(e) => setCommentaireCommercial(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="5"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveComment}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Enregistrer
              </button>
              <button
                onClick={closeModal}
                className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeRdvCommVente;