import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";


export default function ProgressionChart() {
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });

  // Fonction pour formater le mois
  const formatMonth = (monthNumber) => {
    const months = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juill", "Août", "Sept", "Oct", "Nov", "Déc"];
    return months[monthNumber - 1];
  };

  // Récupérer les données depuis l'API
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get('http://51.83.69.195:5000/api/contrats-per-month');
        const categories = result.data.map(item => `${formatMonth(item._id.month)} ${item._id.year}`); // Mois et année formatés
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
        categories: chartData.categories, // Mois formaté
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
<Card className="w-full lg:w-[90%] xl:w-[80%] mx-auto">
  <CardHeader
    floated={false}
    shadow={false}
    color="transparent"
    className="flex flex-col gap-6 rounded-lg md:flex-row md:items-center"
  >
    <div>
      <Typography variant="h4" color="blue-gray">
        Visualisez le nombre de contrats ajoutés chaque mois.
      </Typography>
    </div>
  </CardHeader>
  <CardBody className="px-6 pb-4">
    <Chart {...chartConfig} className="w-full h-[400px]" />
  </CardBody>
</Card>

  );
}
