import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const Chart = () => {
  const [data, setData] = useState({
    labels: [], // Initialisez les labels à un tableau vide
    datasets: [
      {
        label: 'Nombre de contrats par mois',
        data: [], // Initialisez les données à un tableau vide
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  useEffect(() => {
    axios.get('/api/contrats/count-by-month')
      .then((response) => {
        const mois = Object.keys(response.data);
        const counts = Object.values(response.data);

        setData({
          labels: mois, // Mois-Année
          datasets: [
            {
              label: 'Nombre de contrats par mois',
              data: counts, // Mettre à jour les données avec le compte par mois
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
          ]
        });
      })
      .catch(error => console.error('Erreur lors de la récupération des données', error));
  }, []);

  return (
    <div style={{ width: '80%', height: '500px' }}>
      <h2>Contrats par mois</h2>
      <Bar data={data} />
    </div>
  );
};

export default Chart;
