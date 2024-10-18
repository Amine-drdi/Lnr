import React, { useEffect, useState } from 'react';

function CommercialsToday() {
  const [commercials, setCommercials] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // État de chargement

  useEffect(() => {
    const fetchCommercials = async () => {
      setLoading(true); // Indiquer que le chargement a commencé
      try {
        const response = await fetch('http://localhost:5000/api/contrats/commercials-today');
        
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text); // Lever une erreur si la réponse n'est pas OK
        }

        const data = await response.json();
        setCommercials(data);
      } catch (error) {
        setError('Erreur lors de la récupération des données'); // Gérer les erreurs
        console.error(error);
      } finally {
        setLoading(false); // Indiquer que le chargement est terminé
      }
    };

    fetchCommercials();
  }, []);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Liste des commerciaux ayant ajouté des contrats aujourd'hui</h3>
      {loading ? ( // Afficher le message de chargement
        <p>Chargement...</p>
      ) : error ? (
        <p>{error}</p>
      ) : commercials.length === 0 ? (
        <p>Aucun commercial n'a ajouté de contrat aujourd'hui.</p>
      ) : (
        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md whitespace-nowrap">
          <thead className="bg-blue-gray-500 border-b w-full">
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commercial</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nombre de contrats</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {commercials.map((commercial, index) => (
              <tr className="hover:bg-gray-50 transition-colors" key={index}>
                <td className="px-4 py-3 text-center">{commercial.Commercial || 'N/A'}</td>
                <td className="px-4 py-3 text-center">{commercial.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CommercialsToday;
