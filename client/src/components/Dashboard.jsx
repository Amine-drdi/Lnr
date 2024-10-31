import React, { useEffect, useState } from 'react';
//import { EyeIcon, ShoppingCartIcon, ShoppingBagIcon } from '@heroicons/react/outline';
import { FaFileContract } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";
import { GiDiploma } from "react-icons/gi";
const Dashboard = () => {
  const [contratsAujourdHui, setContratsAujourdHui] = useState(0);
  const [pourcentageProgression, setPourcentageProgression] = useState(0);
  const [table, setTable] = useState(1);

  useEffect(() => {
    // Récupérer les contrats ajoutés aujourd'hui
    const fetchData = async () => {
      const response = await fetch('http://51.83.69.195:5000/api/contrats/today');
      const data = await response.json();
      setContratsAujourdHui(data.todayCount);

      // Calculer le pourcentage de progression
      const progression = data.yesterdayCount
        ? ((data.todayCount - data.yesterdayCount) / data.yesterdayCount) * 100
        : 0;
      setPourcentageProgression(progression);
    };

    fetchData();
  }, []);

  const handleStatsCardClick = (index) => setTable(index);

  const stats = [
    {
      title: 'Vente',
      value: contratsAujourdHui,
      percentage: pourcentageProgression.toFixed(2) + "%",
      icon: <FaFileContract className='h-6 w-6'/>,
      trend: 'up',
    },
    {
      title: 'Prise de RDV',
      value: '',
      percentage: '',
      icon: <BsCalendarDateFill className='h-6 w-6'/>,
      trend: 'up',
    },
    {
      title: 'OPCO',
      value: '',
      percentage: '',
      icon: <GiDiploma className='h-6 w-6'/>,
      trend: 'up',
    },
  ];

  return (
    <div className="flex space-x-4">
      {stats.map((stat, index) => (
        <DashboardCard key={index} {...stat} />
      ))}
    </div>
  );
};

const DashboardCard = ({ title, value, percentage, icon, trend }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 h-32  w-80">
      <div className="flex items-center">
        <div className="p-2 bg-indigo-100 rounded-full">
          {icon}
        </div>
        <div className="ml-4">
          <h4 className="text-gray-500">{title}</h4>
          <div className="text-2xl font-semibold text-gray-800">{value}</div>
        </div>
      </div>
      <div className={`mt-2 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {percentage} {trend === 'up' ? '▲' : '▼'}
      </div>
    </div>
  );
};

export default Dashboard;
