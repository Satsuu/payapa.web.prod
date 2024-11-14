import { useEffect, useState } from "react";
import "../index.css";
import {
  Container,
  Breadcrumb,
} from "react-bootstrap";
import useAverageStatus from "../hooks/useAverageStatus";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const { score } = useAverageStatus();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const stressCounts = { Low: 0, Medium: 0, High: 0, "Very High": 0, Severe: 0 };

    score.forEach((entry) => {
      if (entry.stress_level in stressCounts) {
        stressCounts[entry.stress_level]++;
      }
    });

    setChartData({
      labels: ["Low", "Medium", "High", "Very High", "Severe"],
      datasets: [
        {
          label: "Number of Users",
          data: [
            stressCounts["Low"],
            stressCounts["Medium"],
            stressCounts["High"],
            stressCounts["Very High"],
            stressCounts["Severe"],
          ],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    });
  }, [score]);

  return (
    <>
      <Container className="mt-5">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>
            Dashboard
          </Breadcrumb.Item>
        </Breadcrumb>
        <div>
          {chartData && (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: {
                    display: true,
                    text: "Psychological Assessment",
                  },
                },
                scales: {
                  x: { title: { display: true, text: "Level of Stress" } },
                  y: { title: { display: true, text: "Number of Users" } },
                },
              }}
            />
          )}
        </div>
      </Container>
    </>
  );
}

export default Dashboard;
