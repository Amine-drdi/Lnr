import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; // Assure-toi d'avoir installé axios
import { useNavigate } from 'react-router-dom';

function Souscription({ setIsAdding }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [phoneNumber, setPhone] = useState('');
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
  const [interetClient, setIntertClient] = useState('');
  const [apporteurAffaire, setApporteurAffaire] = useState('');
  const [Commercial, setUserName] = useState(''); // Pour stocker le nom de l'utilisateur

  const textInput = useRef(null);
  const navigate = useNavigate(); // Utilisation du hook navigate pour rediriger

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }

    // Fonction pour récupérer les informations du profil
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Récupère le token d'authentification depuis le localStorage
        if (token) {
          const response = await axios.get('http://51.83.69.195:5000/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`, // Envoie le token dans les en-têtes
            },
          });
          setUserName(response.data.user.name); // Définit le nom de l'utilisateur récupéré
        } else {
          navigate('/'); // Redirige si pas de token
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        navigate('/'); // Redirige en cas d'erreur
      }
    };

    fetchProfile();
  }, [navigate]); // Le useEffect dépend de navigate

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !phoneNumber || !email || !dob || !address || !profession || !signatureDate || !cotisation || !compagnie || !effetDate || !businessIntroducer) {
      return Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Tous les champs sont obligatoires.',
        showConfirmButton: true,
        timer: 1500,
      });
    }

    const newContract = {
      firstName,
      lastName,
      phoneNumber,
      email,
      dob,
      address,
      profession,
      signatureDate,
      cotisation,
      compagnie,
      effetDate,
      entryFee,
      fileFee,
      clientInterest,
      businessIntroducer,
      Commercial
    };

    try {
      const response = await fetch('http://51.83.69.195:5000/api/contrats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContract),
      });

      if (response.ok) {
        const result = await response.json();
        if (typeof setContrat === 'function') {
          setContrat((prevContrats) => [...prevContrats, result.contrat]);
        } else {
          console.error("setContrat n'est pas une fonction");
        }

        Swal.fire({
          icon: 'success',
          title: 'Ajouté',
          text: `Les données de ${firstName} ${lastName} ont été ajoutées.`,
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
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhone(e.target.value)}
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
              onChange={(e) => setIntertClient(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
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
          <option value="Eya Ben Jabra">Eya Ben Jabra</option>
          <option value="Rim Dabebi ">Rim Dabebi </option>
         
        </select>
    
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
