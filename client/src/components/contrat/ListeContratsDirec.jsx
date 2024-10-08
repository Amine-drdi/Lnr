import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
function ListeContratsDirec() {
  const [contrats, setContrats] = useState([]);
  const [filteredContrats, setFilteredContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editContratId, setEditContratId] = useState(null);
  const [updatedContrat, setUpdatedContrat] = useState({});
  const compagnies = ["Néoliane", "Assurema", "Alptis", "April", "Malakoff Humanis", "Cegema", "Swisslife"];
  const etatDocs = ["" , "Validé", "Non validé", "NRP" , "Impayé", "Sans effet", "Rétractation", "Résigné"];
  const typeResiliations= ["" , "Infra", "Résiliation à échéance"];
  const [selectedMonth, setSelectedMonth] = useState(''); // Nouveau state pour le mois
  const [selectedContrat, setSelectedContrat] = useState(null); // Contrat sélectionné pour le modal
  const [showModal, setShowModal] = useState(false); // Contrôle du modal
  useEffect(() => {
    const fetchContrats = async () => {
      try {
        const response = await fetch('http://51.83.69.195:5000/api/contrats');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des contrats');
        }
        const data = await response.json();
         // Filtrer les contrats dès la récupération pour exclure ceux sans date de signature
         const validContrats = data.contrats.filter(contrat => contrat.signatureDate && contrat.signatureDate.trim() !== '');
  
         setContrats(validContrats);
         setFilteredContrats(validContrats);
       } catch (error) {
         setError(error.message);
       } finally {
         setLoading(false);
       }
     };
   
     fetchContrats();
   }, []);

  useEffect(() => {
    const results = contrats.filter((contrat) =>
      `${contrat.nom} ${contrat.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContrats(results);
  }, [searchTerm, contrats]);

  const handleEditClick = (contrat) => {
    setEditContratId(contrat._id);
    setUpdatedContrat(contrat);
  };

  const handleSaveClick = async (id) => {
    try {
      const response = await fetch(`http://51.83.69.195:5000/api/contrats/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContrat),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du contrat');
      }

      const updatedList = contrats.map((contrat) =>
        contrat._id === id ? updatedContrat : contrat
      );
      setContrats(updatedList);
      setEditContratId(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`http:/51.83.69.195:5000/api/contrats/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du contrat');
      }

      const updatedList = contrats.filter((contrat) => contrat._id !== id);
      setContrats(updatedList);
      setFilteredContrats(updatedList);
    } catch (error) {
      setError(error.message);
    }
  };
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
    const filtered = contrats.filter((contrat) => {
      const signatureMonth = extractMonthFromDate(contrat.signatureDate); // Obtenez le mois de la date de signature
      const isMonthMatch = selectedMonth ? signatureMonth === parseInt(selectedMonth) : true;
      
      return isMonthMatch; // Adjust your condition to suit any other filters
    });

    setFilteredContrats(filtered);
  }, [contrats, selectedMonth]); // Ensure correct dependencies
  const handleInputChange = (e) => {
    setUpdatedContrat({ ...updatedContrat, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e) => {
    setUpdatedContrat({ ...updatedContrat, [e.target.name]: e.target.value });
  };
  const handleViewContrat = (contrat) => {
    setSelectedContrat(contrat); // Définir le contrat sélectionné
    setShowModal(true); // Afficher le modal
  };

  const closeModal = () => {
    setShowModal(false); // Fermer le modal
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Chargement des contrats...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-blue-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-left  text-blue-gray-700 mb-6 border-b pb-4 ">Liste des Contrats</h1>
      <div className="mb-4">
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
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">état du dossier</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date de Signature</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Numéro de téléphone</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Compagnie</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commercial</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date d'Effet</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Montant VP/mois</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Ancienne Mutuelle</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Type de résiliation</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Retour compagnie</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Suivie gestion</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Remarque gestionnaire</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredContrats.map((contrat) => (
              <tr key={contrat._id} className="hover:bg-gray-50 transition-colors">
             <td className="px-4 py-3 text-sm text-gray-700">
             {editContratId === contrat._id ? (
              <button onClick={() => handleSaveClick(contrat._id)} className="text-blue-500">
              Sauvegarder
              </button>
               ) : (
               <div className="flex items-center space-x-2">
                <FaEye 
                 className="text-blue-500 cursor-pointer w-4 h-4" 
                 onClick={() => handleViewContrat(contrat)}
                />
                <FontAwesomeIcon
                 icon={faEdit}
                 className="text-indigo-600 cursor-pointer w-4 h-4"
                 onClick={() => handleEditClick(contrat)}
                />
                <FontAwesomeIcon
                 icon={faTrash}
                 className="text-red-500 cursor-pointer w-4 h-4"
                 onClick={() => handleDeleteClick(contrat._id)}
                />
               </div>
             )}
            </td>

            <td className="px-4 py-3 text-sm text-gray-700">
                 {editContratId === contrat._id ? (
                <select
                  name="etatDossier"
                  value={updatedContrat.etatDossier}
                  onChange={handleSelectChange}
                  className="border rounded-md p-2"
                 >
                 {etatDocs.map(etatDossier => (
                 <option key={etatDossier} value={etatDossier}>
                 {etatDossier}
                 </option>
                 ))}
                 </select>
                 ) : (
                 contrat.etatDossier
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="nom"
                      value={updatedContrat.nom}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.nom
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="prenom"
                      value={updatedContrat.prenom}
                      onChange={handleInputChange}
                      className="border rounded-md p-2 text-black"
                    />
                  ) : (
                    contrat.prenom
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="date de signature"
                      value={updatedContrat.signatureDate}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.signatureDate
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="email"
                      value={updatedContrat.email}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.email
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="telephone"
                      value={updatedContrat.telephone}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.telephone
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                 {editContratId === contrat._id ? (
                <select
                  name="signatureType2"
                  value={updatedContrat.compagnie}
                  onChange={handleSelectChange}
                  className="border rounded-md p-2"
                 >
                 {compagnies.map(compagnie => (
                 <option key={compagnie} value={compagnie}>
                 {compagnie}
                 </option>
                 ))}
                 </select>
                 ) : (
                 contrat.compagnie
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                  <input
                  type="text"
                  name="Commercial"
                  value={updatedContrat.Commercial}
                  onChange={handleInputChange}
                  className="border rounded-md p-2"
                  />
                 ) : (
                contrat.Commercial
                 )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="effetDate"
                      value={updatedContrat.effetDate}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.effetDate
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="cotisation"
                      value={updatedContrat.cotisation}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.cotisation
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="num_ancien_contrat"
                      value={updatedContrat.ancienneMutuelle}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.ancienneMutuelle
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                 {editContratId === contrat._id ? (
                <select
                  name="typeResiliation"
                  value={updatedContrat.typeResiliation}
                  onChange={handleSelectChange}
                  className="border rounded-md p-2"
                 >
                 {typeResiliations.map(typeResiliation => (
                 <option key={typeResiliation} value={typeResiliation}>
                 {typeResiliation}
                 </option>
                 ))}
                 </select>
                 ) : (
                 contrat.typeResiliation
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="retourCompagnie"
                      value={updatedContrat.retourCompagnie}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.retourCompagnie
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="suivieGestion"
                      value={updatedContrat.suivieGestion}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.suivieGestion
                  )}
                </td>


                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="remarque"
                      value={updatedContrat.remarque}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.remarque
                  )}
                </td>


                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="commentaire"
                      value={updatedContrat.commentaire}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.commentaire
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
      </div>
            {/* Modal */}
            {showModal && selectedContrat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-2xl text-blue-500 font-semibold mb-4">Détails du Contrat</h2>
            <p className='text-left'><strong>État du dossier :</strong> {selectedContrat.etatDossier}</p>
            <p className='text-left'><strong>Date de Signature :</strong> {selectedContrat.signatureDate}</p>
            <p className='text-left'><strong>Nom :</strong> {selectedContrat.nom}</p>
            <p className='text-left'><strong>Prénom :</strong> {selectedContrat.prenom}</p>
            <p className='text-left'><strong>Email :</strong> {selectedContrat.email}</p>
            <p className='text-left'><strong>Télephone :</strong> {selectedContrat.telephone}</p>
            <p className='text-left'><strong>Date d'Effet :</strong> {selectedContrat.effetDate}</p>
            <p className='text-left'><strong>Commercial :</strong> {selectedContrat.Commercial}</p>
            <p className='text-left'><strong>Compagnie :</strong> {selectedContrat.compagnie}</p>
            <p className='text-left'><strong>Montant VP/mois :</strong> {selectedContrat.cotisation}</p>
            <p className='text-left'><strong>Ancienne mutuelle :</strong> {selectedContrat.ancienneMutuelle}</p>
            <p className='text-left'><strong>Retour Compagnie :</strong> {selectedContrat.retourCompagnie}</p>
            <p className='text-left'><strong>Suivie gestion :</strong> {selectedContrat.suivieGestion}</p>
            <p className='text-left'><strong>Type de résiliation :</strong> {selectedContrat.typeResiliation}</p>
            <p className='text-left'><strong>Remarque gestionnaire :</strong> {selectedContrat.remarque}</p>
            <p className='text-left'><strong>Commentaire :</strong> {selectedContrat.commentaire}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      </div>
  );
}

export default ListeContratsDirec;
