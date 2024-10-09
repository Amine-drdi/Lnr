import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";

export default function ProgressionChart() {
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });

  // Récupérer les données depuis l'API
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get('http://51.83.69.195:5000/api/contrats-per-month');
        const categories = result.data.map(item => item._id); // Mois
        const series = result.data.map(item => item.count); // Nombre de contrats

        setChartData({
          categories,
          series,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    }

    fetchData();
  }, []);

  // Configurer le graphique avec les données dynamiques
  const chartConfig = {
    type: "bar",
    height: 240,
    series: [
      {
        name: "Contracts",
        data: chartData.series,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617"],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 2,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: chartData.categories, // Mois comme catégorie
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  return (
    <Card>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
          <Square3Stack3DIcon className="h-6 w-6" />
        </div>
        <div>
          <Typography variant="h6" color="blue-gray">
  
          Visualisez le nombre de contrats ajoutés chaque mois.
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}
