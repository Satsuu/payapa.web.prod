import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Container,
  Table,
  Spinner,
  Button,
} from "react-bootstrap";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import useFetchAppointmentHistory from "../hooks/useFetchAppointmentHistory";
import FilterDropdown from "../components/CourseFilter";
import useUserDocument from "../hooks/useUserDocument";
import useFilteredUsers from "../hooks/useFilteredUsers";

function History() {
  const { appointmentHistory, loading, error } = useFetchAppointmentHistory();
  const { userCourses, userRole, error: isError } = useUserDocument();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (appointmentHistory) {
      setUsers(appointmentHistory);
    }
  }, [appointmentHistory]);

  useEffect(() => {
    if (isError) {
      console.error("Error encountered while checking document:", isError);
    }
  }, [isError]);

  if (error) {
    toast.error(`Error loading appointment history: ${error.message}`);
  }

  const handleFilterSelect = (course) => {
    setSelectedCourse(course);
  };

  const filteredUsers = useFilteredUsers(users, userCourses);
  const filteredUsersTable = selectedCourse
    ? filteredUsers.filter(
        (user) =>
          user.course &&
          user.course.toLowerCase() === selectedCourse.toLowerCase()
      )
    : filteredUsers;

  const displayedUsers =
    userRole === "subadmin" ? filteredUsersTable : filteredUsersTable;

  const downloadPDF = () => {
    const doc = new jsPDF();
    html2canvas(document.querySelector("#history-table")).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      doc.save("history_data.pdf");
    });
  };

  return (
    <Container className="mt-5">
      <div>
        <Breadcrumb>
          <Breadcrumb.Item active>Appointment History</Breadcrumb.Item>
        </Breadcrumb>

        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>Appointment History</div>
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
            {loading ? (
              <div className="d-flex justify-content-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : displayedUsers.length === 0 ? (
              <div className="text-center">No appointment history data</div>
            ) : (
              <div style={{ maxHeight: "700px", overflowY: "auto" }}>
                <Table className="cursor-pointer" bordered id="history-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>
                        Course
                        <FilterDropdown
                          onSelect={handleFilterSelect}
                          currentUserCourses={userCourses}
                        />
                      </th>
                      <th className="text-center">Start of Counseling</th>
                      <th className="text-center">End of Counseling</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.fullName}</td>
                        <td>{user.course}</td>
                        <td className="text-center">
                          {user.time} {user.date}
                        </td>
                        <td className="text-center">
                          {user.endTime} {user.endDate}
                        </td>
                        <td>{user.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default History;
