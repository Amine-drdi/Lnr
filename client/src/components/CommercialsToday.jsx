import React, { useEffect, useState } from 'react';
import axios from 'axios';
function CommercialsToday() {
  const [commercials, setCommercials] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // État de chargement
  const [rdvCounts, setRdvCounts] = useState([]);


  useEffect(() => {
    const fetchCommercials = async () => {
      setLoading(true); // Indiquer que le chargement a commencé
      try {
        const response = await fetch('http://51.83.69.195:5000/api/contrats/commercials-today');
        
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
  useEffect(() => {
    const fetchRdvCounts = async () => {
      try {
        const response = await axios.get('/api/rdvs/count-today');
        setRdvCounts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des comptes de RDVs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRdvCounts();
  }, []);

  if (loading) {
    return <p>Chargement des données...</p>;
  }


  return (
    <div>
    <div>
      <h3 className="text-xl font-semibold mb-4">Mutuelle</h3>
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
        <div className='pt-10'>
        <h3 className="text-xl font-semibold mb-4">OPCO</h3>
        
        {loading ? ( // Afficher le message de chargement
        <p>Chargement...</p>
      ) : error ? (
        <p>{error}</p>
      ) :
        rdvCounts.length === 0 ? (
          <p>Aucun RDV trouvé pour aujourd'hui.</p>
        ) : (
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md whitespace-nowrap">
            <thead className="bg-blue-gray-500 border-b w-full">
              <tr>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Agent</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nombre de RDV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rdvCounts.map((rdv) => (
                <tr className="hover:bg-gray-50 transition-colors" key={rdv._id}>
                  <td  className="px-4 py-3 text-center">{rdv._id ? rdv._id : "Utilisateur inconnu"}</td> {/* Si userName est vide */}
                  <td className="px-4 py-3 text-center">{rdv.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
  );
}

export default CommercialsToday;
