import { useEffect, useState, useRef } from "react";
import "../index.css";
import { Container, Breadcrumb, Button, Card, Col, Row } from "react-bootstrap";
import useAverageStatus from "../hooks/useAverageStatus";
import useFetchUsers from "../hooks/useFetchUsers";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getAuth } from "firebase/auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const { score } = useAverageStatus();
  const { approvedCounts } = useFetchUsers();
  const [chartData, setChartData] = useState(null);
  const [approvedChartData, setApprovedChartData] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email === "super_admin@gmail.com") {
      setIsSuperAdmin(true);
    }
  }, []);

  useEffect(() => {
    const stressCounts = {
      Low: 0,
      Medium: 0,
      High: 0,
      "Very High": 0,
      Severe: 0,
    };

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

    if (approvedCounts) {
      const labels = Object.keys(approvedCounts);
      const data = Object.values(approvedCounts);

      setApprovedChartData({
        labels,
        datasets: [
          {
            label: "Approved Users per Course",
            data,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
            hoverOffset: 4,
          },
        ],
      });
    }
  }, [score, approvedCounts]);

  const downloadPDF = async () => {
    const chartElement = chartRef.current;
    if (!chartElement) return;
    const canvas = await html2canvas(chartElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape");
    pdf.addImage(imgData, "PNG", 10, 10, 280, 150);
    pdf.save("stress_assessment_chart.pdf");
  };

  return (
    <>
      <Container className="mt-5">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>
            Dashboard
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="p-3">
          <div className="d-flex justify-content-end">
            {isSuperAdmin && (
              <Button variant="primary" className="mt-3" onClick={downloadPDF}>
                Download as PDF
              </Button>
            )}
          </div>
          {chartData && (
            <div ref={chartRef}>
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
            </div>
          )}
          {approvedChartData && (
            <Card className="mt-4 shadow">
              <Card.Body>
                <Row>
                  {/* Pie Chart on the Left */}
                  <Col
                    md={6}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <Pie
                      data={approvedChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "Approved Users by Course",
                          },
                          legend: {
                            display: false, // Legend will be handled manually
                          },
                        },
                      }}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </Col>

                  {/* Legend and Courses on the Right */}
                  <Col md={6}>
                    <h5 className="mb-4">Course Details</h5>
                    <ul className="list-unstyled">
                      {Object.keys(approvedCounts).map((course, index) => (
                        <li
                          key={course}
                          className="d-flex align-items-center mb-2"
                        >
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor:
                                approvedChartData.datasets[0].backgroundColor[
                                  index
                                ],
                              display: "inline-block",
                              marginRight: 10,
                              borderRadius: "50%",
                            }}
                          ></span>
                          {course}: <strong>{approvedCounts[course]}</strong>
                        </li>
                      ))}
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </div>
      </Container>
    </>
  );
}

export default Dashboard;
