import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';

import { Textarea } from "@material-tailwind/react";
function Souscription({ setIsAdding }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [profession, setProfession] = useState('');
  const [signatureDate, setSignatureDate] = useState('');
  const [vpAmount, setVpAmount] = useState('');
  const [compagnie, setCompagnie] = useState('');
  const [effetDate, setEffetDate] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [fileFee, setFileFee] = useState('');
  const [clientInterest, setClientInterest] = useState('');
  const [businessIntroducer, setBusinessIntroducer] = useState('');
  const textInput = useRef(null);

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !phoneNumber || !email || !dob || !address || !profession || !signatureDate || !vpAmount || !compagnie || !effetDate  || !businessIntroducer   ) {
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
      vpAmount,
      compagnie,
      effetDate,
      entryFee,
      fileFee,
      clientInterest,
      businessIntroducer,
      
      
    };

    try {
      const response = await fetch('http://localhost:5000/api/contrats', {
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
          console.error('setContrat n\'est pas une fonction');
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Ajouté',
          text: `Les données de ${firstName} ${lastName} ont été ajoutées.`,
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        throw new Error('Erreur lors de l\'ajout du contrat');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible d\'ajouter le contrat.',
        showConfirmButton: true,
        timer: 1500,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-blue-gray-50 shadow-lg rounded-lg border border-blue-gray-200">
      <form onSubmit={handleAdd} className="space-y-6">

        {/* Section Identité du Souscripteur */}
        <h2 className="text-2xl font-bold text-blue-gray-800 mb-4">Identité du Souscripteur</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-blue-gray-700">Nom</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-blue-gray-700">Prénom</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
            <label htmlFor="vpAmount" className="block text-sm font-medium text-blue-gray-700">Montant VP/mois</label>
            <input
              id="vpAmount"
              type="text"
              value={vpAmount}
              onChange={(e) => setVpAmount(e.target.value)}
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
          <option value="Cegema">Cegema</option>
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
            <label htmlFor="entryFee" className="block text-sm font-medium text-blue-gray-700">Frais d'entrée</label>
            <input
              id="entryFee"
              type="text"
              value={entryFee}
              onChange={(e) => setEntryFee(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="fileFee" className="block text-sm font-medium text-blue-gray-700">Frais de dossier</label>
            <input
              id="fileFee"
              type="text"
              value={fileFee}
              onChange={(e) => setFileFee(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="clientInterest" className="block text-sm font-medium text-blue-gray-700">Intérêt du Client</label>
            <input
              id="clientInterest"
              type="text"
              value={clientInterest}
              onChange={(e) => setClientInterest(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="apporteur" className="block text-sm font-medium text-blue-gray-700">Apporteur d'affaire</label>
         <select
          id="businessIntroducer"
          name="businessIntroducer"
          value={businessIntroducer}
          onChange={(e) => setBusinessIntroducer(e.target.value)}
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
