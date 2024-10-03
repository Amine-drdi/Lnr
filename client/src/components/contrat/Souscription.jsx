import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; // Assure-toi d'avoir installé axios
import { useNavigate } from 'react-router-dom';

function Souscription({ setIsAdding }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [profession, setProfession] = useState('');
  const [signatureDate, setSignatureDate] = useState('');
  const [cotisation, setCotisation] = useState('');
  const [compagnie, setCompagnie] = useState('');
  const [effetDate, setEffetDate] = useState('');
  const [fraisEntre, setFraisEntre] = useState('');
  const [fraisDossier, setFraisDossier] = useState('');
  const [interetClient, setInteretClient] = useState('');
  const [apporteurAffaire, setApporteurAffaire] = useState('');
  const [ancienneMutuelle , setAncienneMutuelle] = useState('');
  const [typeResiliation , setTypeResiliation] = useState('');
  const [file, setFile] = useState(null); // Capture le fichier sélectionné
  const [Commercial, setUserName] = useState('');

  const textInput = useRef(null);
  const navigate = useNavigate(); // Utilisation du hook navigate pour rediriger

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }

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
  }, [navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Capture le fichier sélectionné
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!nom || !prenom || !telephone || !email || !dob || !address || !profession || !signatureDate || !cotisation || !compagnie || !effetDate || !apporteurAffaire) {
      return Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Tous les champs sont obligatoires.',
        showConfirmButton: true,
        timer: 1500,
      });
    }

    // Utilisation de FormData pour envoyer le fichier et les données
    const formData = new FormData();

    formData.append('nom', nom);
    formData.append('prenom', prenom);
    formData.append('telephone', telephone);
    formData.append('email', email);
    formData.append('dob', dob);
    formData.append('address', address);
    formData.append('profession', profession);
    formData.append('signatureDate', signatureDate);
    formData.append('cotisation', cotisation);
    formData.append('compagnie', compagnie);
    formData.append('effetDate', effetDate);
    formData.append('fraisEntre', fraisEntre);
    formData.append('fraisDossier', fraisDossier);
    formData.append('interetClient', interetClient);
    formData.append('apporteurAffaire', apporteurAffaire);
    formData.append('Commercial', Commercial);

    // Ajouter le fichier
    if (file) {
      formData.append('fichier', file); // Assurez-vous que 'fichier' correspond au nom attendu par le backend
    }

    try {
      const response = await fetch('http://localhost:5000/api/contrats', {
        method: 'POST',
        body: formData, // Envoi du formData avec le fichier
      });

      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Ajouté',
          text: `Les données de ${nom} ${prenom} ont été ajoutées.`,
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        throw new Error("Erreur lors de l'ajout du contrat");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Impossible d'ajouter le contrat.",
        showConfirmButton: true,
        timer: 1500,
      });
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-blue-gray-50 shadow-lg rounded-lg border border-blue-gray-200">
      <form onSubmit={handleAdd} className="space-y-6">
      
        {/* Section Identité du Souscripteur */}
        <h2 className="text-2xl font-bold text-blue-gray-800 mb-4">Identité du Souscripteur  </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-blue-gray-700">Nom</label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-blue-gray-700">Prénom</label>
            <input
              id="prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-blue-gray-700">Téléphone</label>
            <input
              id="telephone"
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-blue-gray-700">Date de Naissance</label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-blue-gray-700">Adresse</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-blue-gray-700">Profession</label>
            <input
              id="profession"
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
        </div>

        {/* Section Contrat */}
        <h2 className="text-2xl font-bold text-blue-gray-800 mb-4">Contrat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="signatureDate" className="block text-sm font-medium text-blue-gray-700">Date de Signature</label>
            <input
              id="signatureDate"
              type="date"
              value={signatureDate}
              onChange={(e) => setSignatureDate(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="cotisation" className="block text-sm font-medium text-blue-gray-700">Montant VP/mois</label>
            <input
              id="cotisation"
              type="text"
              value={cotisation}
              onChange={(e) => setCotisation(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="compagnie" className="block text-sm font-medium text-blue-gray-700">Compagnie</label>
            <select
          id="compagnie"
          name="compagnie"
          value={compagnie}
          onChange={(e) => setCompagnie(e.target.value)}
          className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
        >
          <option value="">Sélectionnez la compagnie</option>
          <option value="Neolyane">Néoliane</option>
          <option value="Assurema">Assurema</option>
          <option value="Alptis">Alptis</option>
          <option value="April">April</option>
          <option value="Malakoff Humanis">Malakoff Humanis</option>
          <option value="Cegema">Cegema</option>
          <option value="Swisslife">Swisslife</option>
          <option value="Soly Azar">Soly Azar</option>
          <option value="Zenio">Zenio</option>
        </select>
          </div>
          <div>
            <label htmlFor="effetDate" className="block text-sm font-medium text-blue-gray-700">Date d'effet</label>
            <input
              id="effetDate"
              type="date"
              value={effetDate}
              onChange={(e) => setEffetDate(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="fraisEntre" className="block text-sm font-medium text-blue-gray-700">Frais d'entrée</label>
            <input
              id="fraisEntre"
              type="text"
              value={fraisEntre}
              onChange={(e) => setFraisEntre(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="fraisDossier" className="block text-sm font-medium text-blue-gray-700">Frais de dossier</label>
            <input
              id="fraisDossier"
              type="text"
              value={fraisDossier}
              onChange={(e) => setFraisDossier(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="interetClient" className="block text-sm font-medium text-blue-gray-700">Intérêt du Client</label>
            <input
              id="interetClient"
              type="text"
              value={interetClient}
              onChange={(e) => setInteretClient(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="ancienneMutuelle" className="block text-sm font-medium text-blue-gray-700">Ancienne Mutuelle</label>
            <input
              id="ancienneMutuelle"
              type="text"
              value={ancienneMutuelle}
              onChange={(e) => setAncienneMutuelle(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="typeResiliation" className="block text-sm font-medium text-blue-gray-700">Type de Résiliation</label>
         <select
          id="typeResiliation"
          name="typeResiliation"
          value={typeResiliation}
          onChange={(e) => setTypeResiliation(e.target.value)}
          className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
        >
          <option value=""></option>
          <option value="Infra">Infra</option>
          <option value="Résiliation à échéance">Résiliation à échéance </option>

        </select>
    
          </div>
          <div>
            <label htmlFor="apporteur" className="block text-sm font-medium text-blue-gray-700">Apporteur d'affaire</label>
         <select
          id="apporteur"
          name="apporteur"
          value={apporteurAffaire}
          onChange={(e) => setApporteurAffaire(e.target.value)}
          className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
        >
          <option value=""></option>
          <option value="Cyrine Ben Aicha">Cyrine Ben Aicha</option>
          <option value="Sihem Selemi">Sihem Selemi</option>
          <option value="Hajer Askri">Hajer Askri</option>
          <option value="Rim Dabebi ">Rim Dabebi </option>
          <option value="Eya Ben Jabra">Eya Ben Jabra</option>
          <option value="Leads">Leads </option>
         
        </select>
    
          </div>

          <div>
         <label htmlFor="file" className="block text-sm font-medium text-blue-gray-700 mb-2">Fichier</label>
         <input 
         onChange={handleFileChange} // Utilisez handleFileChange pour capturer le fichier
        className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
        id="file"
        type="file"
        />
</div>

        </div>

        <button type="submit" className="bg-blue-gray-600 text-white py-2 px-6 rounded-lg hover:bg-blue-gray-700 transition duration-150">
          Ajouter le contrat
        </button>
      
      </form>
    </div>
  );
}

export default Souscription;