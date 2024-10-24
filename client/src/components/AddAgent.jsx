import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@material-tailwind/react";
const AddAgent = () => {
  const [formData, setFormData] = useState({
    matricule: '',
    name: '',
    password: '',
    role: 'Commerciale' // Valeur par défaut pour le rôle
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Données du formulaire:', formData); // Vérifiez les données du formulaire
    try {
      const response = await axios.post('http://51.83.69.195:5000/api/registerEmp', formData);
      alert(response.data.message);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'employé', error.response?.data || error.message);
    }
  };

  return (
<section className="bg-white">
 {/* <div className="grid grid-cols-1 lg:grid-cols-2">
     Retirer cette div pour enlever l'image */}
    {/* <div className="relative flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <img
          className="object-cover object-top w-full h-full"
          src={img}
          alt=""
        />
      </div>
    </div> */}

    <div className="flex items-center justify-center px-4 bg-white sm:px-6 lg:px-8 sm:py-2 lg:py-8">
      <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto pt-2">
        <h2 className="text-3xl font-bold leading-tight pt-2 text-blue-gray-700 sm:text-4xl">Ajouter un employé</h2>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="maticule" className="text-base font-medium text-gray-900">Numéro ID</label>
              <input
                type="text"
                id="matricule"
                value={formData.matricule}
                onChange={handleChange}
                placeholder="Entrer l'ID"
                className="block w-full py-4 pl-10 pr-4 text-black border border-gray-200 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="name" className="text-base font-medium text-gray-900">Nom et Prénom</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Entrer le nom"
                className="block w-full py-4 pl-10 pr-4 text-black border border-gray-200 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-base font-medium text-gray-900">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrer le mot de passe"
                className="block w-full py-4 pl-10 pr-4 text-black border border-gray-200 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="role" className="text-base font-medium text-gray-900">Rôle</label>
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full py-4 pl-10 pr-4 text-black border border-gray-200 rounded-md"
              >
                <option value="Manager">Manager</option>
                <option value="Commerciale">Commercial</option>
                <option value="Gestionnaire">Gestionnaire</option>
                <option value="Direction">Direction</option>
                <option value="ManagerOPCO">Manager-OPCO</option>
                <option value="CommercialeOPCO">Commerciale-OPCO</option>
                <option value="CommercialeVente">Commerciale-Vente</option>
              </select>
            </div>

            <Button type="submit" color="blue">Ajouter</Button>
          </div>
        </form>
      </div>
    </div>

</section>

  );
};

export default AddAgent;
