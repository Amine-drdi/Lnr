import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import { FaFileContract } from "react-icons/fa";
import { BsBarChartLineFill } from "react-icons/bs";
import { GrBusinessService } from "react-icons/gr";
import axios from 'axios'; // Assurez-vous d'avoir axios installé
import CommercialsToday from './CommercialsToday';
import ProgressionChart from './ProgressionChart';

function Dashboard() {
  const [table, setTable] = useState(1);
  const [contractsSignedToday, setContractsSignedToday] = useState(0);
  useEffect(() => {
    const fetchContractsToday = async () => {
      try {
        const response = await axios.get('/api/contrats/today');
        setContractsSignedToday(response.data.contrats?.length);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };

    fetchContractsToday();
  }, []);


  const handleStatsCardClick = (value) => {
    setTable(value);
  };



  return (
    <div className="text-center">
      <h2 className='text-2xl font-semibold'>Tableau de Bord</h2>

      <div className="pl-48 pt-10 mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4 mt-5">
        <StatsCard
          icon={<FaFileContract className='h-6 w-6' />}
          bgColor="bg-gradient-to-tr from-blue-600 to-blue-400 shadow-blue-500/40"
          title="Nombre de contrats signés aujourd'hui"
          amount=  {contractsSignedToday} 
          percentage="+55%"
          percentageColor="text-green-500"
          onClick={() => handleStatsCardClick(1)}
          isActive={table === 1}
        />
        <StatsCard
          icon={<BsBarChartLineFill className='h-6 w-6' />}
          bgColor="bg-gradient-to-tr from-pink-600 to-pink-400 shadow-pink-500/40"
          title="Progression Mensuelle des Contrats"
          amount="2,300"
          percentage="+3%"
          percentageColor="text-green-500"
          onClick={() => handleStatsCardClick(2)}
          isActive={table === 2}
        />
        <StatsCard
          icon={<GrBusinessService className='h-6 w-6' />}
          bgColor="bg-gradient-to-tr from-green-600 to-green-400 shadow-green-500/40"
          title="Liste des compagnies signées aujourd'hui"
          amount="3,462"
          percentage="-2%"
          percentageColor="text-red-500"
          onClick={() => handleStatsCardClick(3)}
          isActive={table === 3}
        />
      </div>
      {table === 1 && <div className='flex justify-center items-center h-full'><CommercialsToday/></div>}
      {table === 2 && <div className='flex justify-center items-center h-full'><ProgressionChart/></div>}
      {table === 3 && <div className='flex justify-center items-center h-full'>hello</div>}
    </div>
  );
}

export default Dashboard;
