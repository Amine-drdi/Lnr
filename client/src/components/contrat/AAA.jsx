import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
function ListeContratsGestio() {
  const [contrats, setContrats] = useState([]);
  const [filteredContrats, setFilteredContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editContratId, setEditContratId] = useState(null);
  const [updatedContrat, setUpdatedContrat] = useState({});
  const signatureTypes = ["Lead", "RDV", "RDV à chaud"];
  const compagnies = ["Néoliane", "Assurema", "Alptis", "April", "Malakoff Humanis", "Cegema", "Swisslife"];
  const etatDocs = ["" , "Validé", "Non validé","NRP" , "Impayé", "Sans effet", "Rétractation", "Résigné"];
  const typeResiliations= ["" , "Infra", "Résiliation à échéance"];
  const apporteurAffaires= ["Cyrine Ben Aicha" , "Sihem Selemi", "Hajer Askri" , "Rim Dabebi" , "Eya Ben Jabra" , "Rihab Kouki" ,"Leads"];
  const [selectedMonth, setSelectedMonth] = useState(''); // Nouveau state pour le mois
  const [selectedContrat, setSelectedContrat] = useState(null); // Contrat sélectionné pour le modal
  const [showModal, setShowModal] = useState(false); // Contrôle du modal
  
  useEffect(() => {
    const fetchContrats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/contrats');
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
      `${contrat.nom} ${contrat.prenom} ${contrat.Commercial}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContrats(results);
  }, [searchTerm, contrats]);

  const handleEditClick = (contrat) => {
    setEditContratId(contrat._id);
    setUpdatedContrat(contrat);
  };
  

  const handleSaveClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/contrats/${id}`, {
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
  
    // Filtrage selon le commercial, la recherche et le mois
    useEffect(() => {
      const filtered = contrats.filter((contrat) => {
        if (!contrat.signatureDate) return false; // S'assurer que la date de signature existe
    
        const signatureDate = new Date(contrat.signatureDate); // Créer un objet Date à partir de la chaîne de date
        const signatureMonth = signatureDate.getMonth() + 1; // Obtenir le mois de 1 à 12
    
        const isMonthMatch = selectedMonth ? signatureMonth === parseInt(selectedMonth, 10) : true;
    
        return isMonthMatch;
      });
    
      setFilteredContrats(filtered);
    }, [contrats, selectedMonth]);
    


  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/contrats/${id}`, {
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

      {/* Modal */}
        {showModal && selectedContrat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-2xl text-blue-500 font-semibold mb-4">Détails du Contrat</h2>
            <p className='text-left'><strong>État du dossier :</strong> {selectedContrat.etatDossier}</p>
            <p className='text-left'><strong>Nom:</strong> {selectedContrat.nom ? selectedContrat.nom.toUpperCase() : ''}</p>
            <p className='text-left'><strong>Prénom:</strong> {selectedContrat.prenom ? selectedContrat.prenom.toUpperCase() : ''}</p>
            <p className='text-left'><strong>Date de Signature :</strong> {selectedContrat.signatureDate}</p>
            <p className='text-left'><strong>Email:</strong> {selectedContrat.email}</p>
            <p className='text-left'><strong>Téléphone :</strong> {selectedContrat.telephone}</p>
            <p className='text-left'><strong>Compagnie :</strong> {selectedContrat.compagnie}</p>
            <p className='text-left'><strong>Commercial :</strong> {selectedContrat.Commercial}</p>
            <p className='text-left'><strong>Date d'Effet :</strong> {selectedContrat.effetDate}</p>
            <p className='text-left'><strong>Montant VP/mois :</strong> {selectedContrat.cotisation}</p>
            <p className='text-left'><strong>Ancienne mutuelle :</strong> {selectedContrat.ancienneMutuelle}</p>
            <p className='text-left'><strong>Type de résiliation:</strong> {selectedContrat.typeResiliation}</p>
            <p className='text-left'><strong>Retour compagnie :</strong> {selectedContrat.retourCompagnie}</p>
            <p className='text-left'><strong>Suivi gestion :</strong> {selectedContrat.suiviGestion}</p>
            <p className='text-left'><strong>Remarque :</strong> {selectedContrat.remarque}</p>
            <p className='text-left'><strong>Commentaire du gestionnaire :</strong> {selectedContrat.commentaire}</p>
            <p className='text-left'><strong>Commentaire de l'agent :</strong> {selectedContrat.commentaireAgent}</p>
         

            {selectedContrat.file && (
        <p className='text-left'>
          <strong>Fichier :</strong> 
          <a 
            href={`http://localhost:5000/${selectedContrat.file}`} // Assurez-vous que le chemin est correct
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline"
          >
            Voir le fichier
          </a>
        </p>
      )}
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

export default ListeContratsGestio;