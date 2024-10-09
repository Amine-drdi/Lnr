import { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

export default function ProgressionChart() {
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get('http://51.83.69.195:5000/api/contrats-per-month');
      const categories = result.data.map(item => item._id);
      const series = result.data.map(item => item.count);
      
      setChartData({
        categories,
        series,
      });
    }

    fetchData();
  }, []);

  const chartConfig = {
    type: "bar",
    height: 240,
    series: [{ name: "Contracts", data: chartData.series }],
    options: {
      xaxis: { categories: chartData.categories },
      // autres options...
    },
  };

  return (
    <Card>
      <CardHeader>{/* Vos éléments d'en-tête */}</CardHeader>
      <CardBody>
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}
