import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SouscriptionOPCO({ setIsAdding }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [adresse, setAdresse] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville, setVille] = useState('');
  const [formation, setFormation] = useState('');
  const [datePriseRDV, setDatePriseRDV] = useState('');
  const [dateRDV, setDateRDV] = useState('');
  const [heureRDV, setHeureRDV] = useState('');
  const [userName, setUserName] = useState('');

  const textInput = useRef(null);
  const navigate = useNavigate(); 

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




  const handleAdd = async (e) => {
    e.preventDefault();

    if (!nom || !prenom || !entreprise || !adresse || !codePostal || !ville || !formation || !datePriseRDV || !dateRDV || !heureRDV) {
      return Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Tous les champs sont obligatoires.',
        showConfirmButton: true,
        timer: 1500,
      });
    }

    const newRDV = {
      nom,
      prenom,
      entreprise,
      adresse,
      codePostal,
      ville,
      formation,
      datePriseRDV,
      dateRDV,
      heureRDV,
      userName
    };

    try {
      const response = await fetch('http://localhost:5000/api/rdvs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRDV),
      });

      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Ajouté',
          text: `Le rendez-vous de ${nom} ${prenom} a été ajouté.`,
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        throw new Error("Erreur lors de l'ajout du rendez-vous");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Impossible d'ajouter le rendez-vous.",
        showConfirmButton: true,
        timer: 1500,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-blue-gray-50 shadow-lg rounded-lg border border-blue-gray-200">
      <form onSubmit={handleAdd} className="space-y-6">
      
        <h2 className="text-2xl font-bold text-blue-gray-800 mb-4">Formulaire de Rendez-vous</h2>
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
            <label htmlFor="entreprise" className="block text-sm font-medium text-blue-gray-700">Nom de l’entreprise</label>
            <input
              id="entreprise"
              type="text"
              value={entreprise}
              onChange={(e) => setEntreprise(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-blue-gray-700">Adresse</label>
            <input
              id="adresse"
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="codePostal" className="block text-sm font-medium text-blue-gray-700">Code postal</label>
            <input
              id="codePostal"
              type="text"
              value={codePostal}
              onChange={(e) => setCodePostal(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="ville" className="block text-sm font-medium text-blue-gray-700">Ville</label>
            <input
              id="ville"
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="formation" className="block text-sm font-medium text-blue-gray-700">Formation demandée</label>
            <input
              id="formation"
              type="text"
              value={formation}
              onChange={(e) => setFormation(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="datePriseRDV" className="block text-sm font-medium text-blue-gray-700">Date de prise de rendez-vous</label>
            <input
              id="datePriseRDV"
              type="date"
              value={datePriseRDV}
              onChange={(e) => setDatePriseRDV(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="dateRDV" className="block text-sm font-medium text-blue-gray-700">Date du rendez-vous</label>
            <input
              id="dateRDV"
              type="date"
              value={dateRDV}
              onChange={(e) => setDateRDV(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="heureRDV" className="block text-sm font-medium text-blue-gray-700">Heure du rendez-vous</label>
            <input
              id="heureRDV"
              type="time"
              value={heureRDV}
              onChange={(e) => setHeureRDV(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
        </div>

        <button type="submit" className="bg-blue-gray-600 text-white py-2 px-6 rounded-lg hover:bg-blue-gray-700 transition duration-150">
          Enregistrer le rendez-vous
        </button>
      
      </form>
    </div>
  );
}

export default SouscriptionOPCO;
