import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommercialsToday = () => {
  const [commerciaux, setCommerciaux] = useState([]);

  useEffect(() => {
    // Appel à l'API pour récupérer les commerciaux et leurs contrats
    axios.get('/api/commerciaux/contrats-aujourdhui')
      .then(response => {
        setCommerciaux(Object.entries(response.data)); // Transforme l'objet en tableau d'entrées [commercial, nombreContrats]
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des commerciaux', error);
      });
  }, []);

  return (
    <div>
      <h2 className='font-semibold pb-6'>Liste des agents qui ont signés des contrats aujourd'hui</h2>
      <table className=" w-full bg-white border border-gray-200 rounded-lg shadow-md whitespace-nowrap ">
      <thead className="bg-blue-gray-500 border-b w-full">
          <tr>
          <th className="px-4 py-2 text-center text-xs font-medium text-white  tracking-wider">Agent</th>
          <th className="px-4 py-2 text-center text-xs font-medium text-white  tracking-wider">Nombre de contrats signés</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {commerciaux.map(([commercial, nombreContrats]) => (
            <tr key={commercial}>
              <td className="px-4 py-3 text-sm text-gray-700">{commercial}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{nombreContrats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommercialsToday;
