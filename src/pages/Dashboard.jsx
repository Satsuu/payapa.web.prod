import { useEffect, useState, useRef } from "react";
import "../index.css";
import { Container, Breadcrumb, Button, Card, Col, Row } from "react-bootstrap";
import useAverageStatus from "../hooks/useAverageStatus";
import useFetchUsers from "../hooks/useFetchUsers";
import AppointmentHistory from "../components/AppointmentHistory";
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
  const approvedChartRef = useRef(null);
  const [totalApprovedUsers, setTotalApprovedUsers] = useState(0);
  const handleAppointmentHistoryPDF = useRef(null);

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;

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
      const data = labels.map((course) =>
        Object.values(approvedCounts[course]?.roles || {}).reduce(
          (a, b) => a + b,
          0
        )
      );

      const totalApproved = data.reduce((sum, count) => sum + count, 0);
      setTotalApprovedUsers(totalApproved);

      const randomColors = data.map(() => getRandomColor());

      setApprovedChartData({
        labels,
        datasets: [
          {
            label: "Approved Users per Course",
            data,
            backgroundColor: randomColors,
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
    const pdf = new jsPDF("portrait");

    const templateUrl = "/pdf_template.png";

    const response = await fetch(templateUrl);
    const templateBlob = await response.blob();
    const templateUrlObject = URL.createObjectURL(templateBlob);

    pdf.addImage(templateUrlObject, "PNG", 0, 0, 210, 297);

    pdf.addImage(imgData, "PNG", 15, 50, 180, 100);
    pdf.save("stress_assessment_chart.pdf");
  };

  const downloadApprovedChartPDF = async () => {
    const chartElement = approvedChartRef.current;
    if (!chartElement) return;

    const canvas = await html2canvas(chartElement, {
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("portrait");
    const imgWidth = 180;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const templateUrl = "/pdf_template.png";

    const response = await fetch(templateUrl);
    const templateBlob = await response.blob();
    const templateUrlObject = URL.createObjectURL(templateBlob);

    pdf.addImage(templateUrlObject, "PNG", 0, 0, 210, 297);

    const chartX = 10;
    const chartY = 50;
    pdf.addImage(imgData, "PNG", chartX, chartY, imgWidth, imgHeight);
    pdf.save("approved_users_chart.pdf");
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
            <Button variant="outline-secondary" size="sm" onClick={downloadPDF}>
              Download as PDF
            </Button>
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
          {approvedChartData && approvedCounts && (
            <div ref={approvedChartRef}>
              <Card className="mt-4 shadow">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Total Approved Users: {totalApprovedUsers}</h6>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={downloadApprovedChartPDF}
                    >
                      Download as PDF
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col
                      md={6}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <Pie
                        data={approvedChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            title: {
                              display: true,
                              text: "Approved Users by Course",
                            },
                            legend: {
                              display: false,
                            },
                          },
                        }}
                        style={{ maxWidth: "400px", height: "400px" }}
                      />
                    </Col>

                    <Col md={6}>
                      <h5 className="mb-4">Course Role Details</h5>
                      <ul className="list-unstyled">
                        {Object.keys(approvedCounts).map((course, index) => (
                          <li key={course} className="mb-3">
                            <div className="d-flex align-items-center mb-1">
                              <span
                                style={{
                                  width: 20,
                                  height: 20,
                                  backgroundColor:
                                    approvedChartData?.datasets?.[0]
                                      ?.backgroundColor?.[index] || "#000",
                                  display: "inline-block",
                                  marginRight: 10,
                                  borderRadius: "50%",
                                }}
                              ></span>
                              <strong>{course}</strong>
                            </div>
                            <ul className="pl-4">
                              {Object.entries(
                                approvedCounts[course]?.roles || {}
                              ).map(([role, count]) => (
                                <li
                                  key={role}
                                  className="d-flex justify-content-between"
                                >
                                  <span>{role}</span>
                                  <strong>{count}</strong>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}
          <Card className="mt-4 shadow">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h6>Appointment History Analysis</h6>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => handleAppointmentHistoryPDF.current?.()}
              >
                Download as PDF
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={12}>
                  <AppointmentHistory
                    title="Appointments by Course"
                    firestoreCollection="appointmentHistory"
                    onDownload={(downloadFn) => {
                      handleAppointmentHistoryPDF.current = downloadFn;
                    }}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}

export default Dashboard;
