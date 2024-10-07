import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommercialsToday = () => {
  const [contrats, setContrats] = useState([]);
  const [commercials, setCommercials] = useState([]);

  useEffect(() => {
    // Appel à l'API pour récupérer les contrats du jour
    const fetchContratsToday = async () => {
      try {
        const response = await axios.get('/api/contrats/today');
        const contratsToday = response.data.contrats;

        // Groupement par commercial
        const groupedByCommercial = contratsToday.reduce((acc, contrat) => {
          const { Commercial } = contrat;
          if (!acc[Commercial]) {
            acc[Commercial] = { nom: Commercial, nombreContrats: 0 };
          }
          acc[Commercial].nombreContrats += 1;
          return acc;
        }, {});

        // Transformer l'objet en tableau
        setCommercials(Object.values(groupedByCommercial));
        setContrats(contratsToday);
      } catch (error) {
        console.error("Erreur lors de la récupération des contrats", error);
      }
    };

    fetchContratsToday();
  }, []);

  return (
    <div className="container mx-auto p-4">
     <h3 className="text-1xl font-semibold mb-4">Commerciaux ayant signé aujourd'hui</h3>
     <div className="overflow-x-auto">
        <table className="w-full  bg-white border border-gray-200 rounded-lg shadow-md ">
        <thead className="bg-blue-gray-500 border-b w-full">
            <tr>
            <th className="py-3 px-4 border-b-2 border-gray-200 text-center text-lg font-medium text-white">Nom du Commercial</th>
            <th className="py-3 px-4 border-b-2 border-gray-200 text-center text-lg font-medium text-white">Nombre de Contrats Signés</th>
          </tr>
        </thead>
        <tbody>
        {commercials?.length > 0 ? (
              commercials.map((commercial) => (
                <tr key={commercial.nom} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b border-gray-200">{commercial.nom}</td>

                  <td className="py-3 px-4 border-b border-gray-200">{commercial.nombreContrats}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-3 px-4 text-center text-gray-500">Aucun contrat signé aujourd'hui</td>
              </tr>
            )}
          </tbody>
      </table>
      </div>
    </div>
  );
};

export default CommercialsToday;
