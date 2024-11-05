import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TableauCommercial = () => {
  const [classement, setClassement] = useState([]);
  const [apporteurs, setApporteurs] = useState([]);
  const [classementRDV, setClassementRDV] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://51.83.69.195:5000/api/classement');
        setClassement(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Appeler l'API pour obtenir les données des apporteurs d'affaire
    fetch('http://51.83.69.195:5000/api/classement-apporteurs')
      .then(response => response.json())
      .then(data => setApporteurs(data))
      .catch(error => console.error("Erreur lors de la récupération des apporteurs d'affaire:", error));
  }, []);

  useEffect(() => {
    fetch('http://51.83.69.195:5000/api/classement-rdv')
      .then(response => response.json())
      .then(data => setClassementRDV(data))
      .catch(error => console.error("Erreur lors de la récupération des RDVs:", error));
  }, []);
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-gray-500">Commercial Vente</h2>
      <table className="min-w-full bg-white border border-gray-200 ">
        <thead className='bg-blue-gray-500'>
          <tr>
            <th className="py-2 px-4 border-b text-white">Commercial</th>
            <th className="py-2 px-4 border-b text-white">Nombre de Contrats</th>
            <th className="py-2 px-4 border-b text-white">Total montant VP</th>
            <th className="py-2 px-4 border-b text-white">Compagnies Signées</th>
            <th className="py-2 px-4 border-b text-white">Contrats Validés</th>
          </tr>
        </thead>
        <tbody>
          {classement.map((commercial, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{commercial._id}</td>
              <td className="py-2 px-4 border-b">{commercial.nbContrats}</td>
              <td className="py-2 px-4 border-b">{commercial.totalCotisation}</td>
              <td className="py-2 px-4 border-b">
                {commercial.compagnies.join(', ')}
              </td>
              <td className="py-2 px-4 border-b">{commercial.nbContratsValides}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl font-bold mb-4 text-blue-gray-500 pt-12 ">Commercial Prise de RDV</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className='bg-blue-gray-500'>
          <tr>
            <th className="py-2 px-4 border-b text-white">Commercial</th>
            <th className="py-2 px-4 border-b text-white">Nombre de Contrats</th>
            <th className="py-2 px-4 border-b text-white">Total montant VP</th>
            <th className="py-2 px-4 border-b text-white">Contrats Validés</th>
          </tr>
        </thead>
        <tbody>
          {apporteurs.map((apporteur, index) => (
            <tr key={index} className="text-center">
              <td className="border px-4 py-2">{apporteur._id || "Non spécifié"}</td>
              <td className="border px-4 py-2">{apporteur.nbContrats}</td>
              <td className="border px-4 py-2">{apporteur.totalCotisation} €</td>
              <td className="border px-4 py-2">
                {apporteur.compagnies.map((compagnie, i) => (
                  <div key={i}>{compagnie}</div>
                ))}
              </td>
              <td className="border px-4 py-2">{apporteur.nbContratsValides}</td>
            </tr>
          ))}
        </tbody>
      </table>


      <h2 className="text-2xl font-bold mb-4">Commercial OPCO</h2>
      <table className="min-w-full bg-white border border-gray-200 ">
        <thead className='bg-blue-gray-500'>
          <tr>
            <th className="py-2 text-white">Commercial</th>
            <th className="py-2 text-white">Nombre de RDVs</th>
            <th className="py-2 text-white">Formations</th>
          </tr>
        </thead>
        <tbody>
          {classementRDV.map((commercial, index) => (
            <tr key={index} className="text-center">
              <td className="border px-4 py-2">{commercial._id || "Non spécifié"}</td>
              <td className="border px-4 py-2">{commercial.nbRDVs}</td>
              <td className="border px-4 py-2">
                {commercial.formations.map((formation, i) => (
                  <div key={i}>{formation.join(', ')}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableauCommercial;
