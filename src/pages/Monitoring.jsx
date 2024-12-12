import { useState, useMemo, useEffect } from "react";
import {
  Breadcrumb,
  Container,
  Table,
  Spinner,
  Alert,
  Button,
  Tooltip,
  OverlayTrigger,
  Card,
} from "react-bootstrap";
import useFetchUsers from "../hooks/useFetchUsers";
import MonitoringModal from "../components/MonitoringModal";
import useFetchSentiment from "../hooks/useFetchSentiment";
import useAverageStatus from "../hooks/useAverageStatus";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import useNotification from "../hooks/useNotification";
import { getAuth } from "firebase/auth";
import FilterDropdown from "../components/CourseFilter";
import useUserDocument from "../hooks/useUserDocument";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Monitoring() {
  const { users, loading: usersLoading, error: usersError } = useFetchUsers();
  const { userCourses, error: isError } = useUserDocument();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { score } = useAverageStatus();
  const { updateNotificationStatus } = useNotification();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const userIds = useMemo(() => users.map((user) => user.id), [users]);

  useEffect(() => {
    if (isError) {
      console.error("Error encountered while checking document:", isError);
    }
  }, [isError]);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email === "super_admin@gmail.com") {
      setIsSuperAdmin(true);
    }
  }, []);

  const {
    sentiments,
    loading: sentimentsLoading,
    error: sentimentsError,
  } = useFetchSentiment(userIds);

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleNotifyClick = async (uid) => {
    try {
      const result = await updateNotificationStatus(uid);
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const getStarIcons = (scoreValue) => {
    const stars = [];
    const maxStars = 5;
    const filledStars = Math.floor(scoreValue / 10);

    for (let i = 0; i < maxStars; i++) {
      stars.push(
        <OverlayTrigger
          key={i}
          placement="top"
          overlay={<Tooltip>Score: {scoreValue}</Tooltip>}
        >
          {i < filledStars ? (
            <StarIcon style={{ color: "#ffc107" }} />
          ) : (
            <StarBorderIcon style={{ color: "#ffc107" }} />
          )}
        </OverlayTrigger>
      );
    }

    return (
      <div style={{ display: "flex", justifyContent: "center" }}>{stars}</div>
    );
  };

  const findUserScore = (userId) => {
    const userScore = score.find((s) => s.id === userId);
    return userScore ? userScore.score : null;
  };

  const handleFilterSelect = (course) => {
    setSelectedCourse(course);
  };

  const filteredUsers = selectedCourse
    ? users.filter((user) => user.course === selectedCourse)
    : users;

  const downloadPDF = async () => {
    const originalTable = document.querySelector("#monitoring-table");
    const tableClone = originalTable.cloneNode(true);

    const headerRow = tableClone.querySelector("thead tr");
    const rows = tableClone.querySelectorAll("tbody tr");

    const columnsToRemove = [];
    headerRow.querySelectorAll("th").forEach((th, index) => {
      if (
        th.textContent.includes("Details") ||
        th.textContent.includes("Update")
      ) {
        columnsToRemove.push(index);
      }
    });

    columnsToRemove.reverse().forEach((columnIndex) => {
      headerRow.deleteCell(columnIndex);
      rows.forEach((row) => row.deleteCell(columnIndex));
    });

    const doc = new jsPDF();
    const ITEMS_PER_PAGE = 20;
    const margin = 15;
    const templateUrl = "/pdf_template.png";

    const response = await fetch(templateUrl);
    const templateBlob = await response.blob();
    const templateUrlObject = URL.createObjectURL(templateBlob);

    for (let i = 0; i < filteredUsers.length; i += ITEMS_PER_PAGE) {
      if (i > 0) {
        doc.addPage();
      }

      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      const pageTable = tableClone.cloneNode(true);
      const tbody = pageTable.querySelector("tbody");
      const allRows = Array.from(tbody.querySelectorAll("tr"));
      tbody.innerHTML = "";

      const pageRows = allRows.slice(i, i + ITEMS_PER_PAGE);
      pageRows.forEach((row) => tbody.appendChild(row.cloneNode(true)));

      tempDiv.appendChild(pageTable);

      try {
        const canvas = await html2canvas(pageTable);
        const imgData = canvas.toDataURL("image/png");
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        const effectiveWidth = pdfWidth - 2 * margin;

        doc.addImage(templateUrlObject, "PNG", 0, 0, 210, 297);
        doc.addImage(imgData, "PNG", margin, 30, effectiveWidth, pdfHeight);
      } finally {
        document.body.removeChild(tempDiv);
      }
    }

    doc.save("monitoring_data.pdf");
    URL.revokeObjectURL(templateUrlObject);
  };

  return (
    <>
      <Container className="mt-5">
        <Breadcrumb>
          <Breadcrumb.Item active>Students / Employee</Breadcrumb.Item>
        </Breadcrumb>
        {usersLoading && (
          <Spinner animation="border" role="status" className="mt-4">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}

        {usersError && (
          <Alert variant="danger" className="mt-4">
            Error fetching users: {usersError.message}
          </Alert>
        )}

        {!usersLoading && !usersError && (
          <Card className="cursor-pointer">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>Monitoring Data</div>
                <div>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={downloadPDF}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Table bordered className="cursor-pointer" id="monitoring-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>
                      Course
                      <FilterDropdown
                        onSelect={handleFilterSelect}
                        currentUserCourses={userCourses}
                      />
                    </th>
                    {isSuperAdmin && <th>Details</th>}
                    <th>Sentiment Analysis</th>
                    <th>Psychological Assessment</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const userScore = findUserScore(user.id);
                    return (
                      <tr key={user.id}>
                        <td>{`${user.firstName} ${user.lastName}`}</td>
                        <td>{user.studentID}</td>
                        <td>{user.course}</td>
                        {isSuperAdmin && (
                          <td>
                            <Button
                              variant="info"
                              onClick={() => handleShowModal(user)}
                            >
                              View Details
                            </Button>
                          </td>
                        )}
                        <td>
                          {sentimentsLoading ? (
                            <Spinner animation="border" size="sm" />
                          ) : sentimentsError ? (
                            <Alert variant="danger">Error</Alert>
                          ) : (
                            sentiments[user.id] || "No sentiment data"
                          )}
                        </td>
                        <td className="text-center">
                          {userScore !== null
                            ? getStarIcons(userScore)
                            : "No Average Status"}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleNotifyClick(user.id)}
                          >
                            Notify
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
        <MonitoringModal
          show={showModal}
          user={selectedUser}
          onClose={handleCloseModal}
        />
      </Container>
    </>
  );
}

export default Monitoring;
