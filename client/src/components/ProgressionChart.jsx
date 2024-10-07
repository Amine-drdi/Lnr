import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";

export default function ProgressionChart() {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({}); // Ajoutez un état pour les options du graphique

  useEffect(() => {
    // Appel API pour récupérer les données mensuelles
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/contrats/monthly-progression');
        setChartData(response.data.data); // Mettre à jour les données du graphique

        // Configurez les options du graphique après avoir récupéré les données
        setChartOptions({
          chart: {
            toolbar: {
              show: false,
            },
          },
          title: {
            show: false,
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
            categories: [
              "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ],
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
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données de progression :", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div>
          <Typography variant="h6" color="blue-gray">
            Progression Mensuelle des Contrats.
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        {/* Assurez-vous de passer à la fois `series` et `options` au composant Chart */}
        {chartData?.length > 0 && (
          <Chart
            options={chartOptions} // Passez les options ici
            series={[{ name: "Contrats ajoutés", data: chartData }]} // Passez les données ici
            type="bar"
            height={240}
          />
        )}
      </CardBody>
    </Card>
  );
}
