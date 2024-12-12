import { useEffect, useState } from "react";
import { Breadcrumb, Card, Container, Form, Table } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/studentList.json")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) =>
        console.error("Error fetching the student list:", error)
      );
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className="mt-5">
      <div>
        <Breadcrumb>
          <Breadcrumb.Item active>Student List</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="mb-5">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>Student List</div>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type="text"
                  placeholder="Search Name"
                  style={{ paddingLeft: "2rem" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon
                  style={{
                    position: "absolute",
                    left: "0.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "gray",
                  }}
                />
              </div>
            </div>
          </Card.Header>

          <Card.Body>
            <div style={{ height: "700px", overflowY: "auto" }}>
              <Table className="cursor-pointer" bordered id="student-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID Number</th>
                    <th>Course/Year</th>
                    <th>School Year</th>
                    <th>Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={index}>
                      <td>{student.name}</td>
                      <td>{student.idNumber}</td>
                      <td>{student.courseYear}</td>
                      <td>{student.schoolYear}</td>
                      <td>{student.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default StudentList;
