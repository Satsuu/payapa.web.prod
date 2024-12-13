import { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import {
  Breadcrumb,
  Button,
  Card,
  Container,
  Form,
  Table,
} from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [defaultStudents, setDefaultStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedStudents = localStorage.getItem("students");
    if (storedStudents) {
      const parsedStudents = JSON.parse(storedStudents);
      setStudents(parsedStudents);
      setDefaultStudents(parsedStudents);
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const expectedHeaders = [
            "Name",
            "ID number",
            "Course/Year",
            "School year",
            "Semester",
          ];
          const actualHeaders = Object.keys(results.data[0] || {});

          const isValidFormat = expectedHeaders.every((header) =>
            actualHeaders.includes(header)
          );
          if (!isValidFormat) {
            alert(
              "Invalid CSV format. Please ensure the CSV has the correct headers."
            );
            return;
          }

          setStudents(results.data);
          setDefaultStudents(results.data);
          localStorage.setItem("students", JSON.stringify(results.data));
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const filteredStudents = (
    students.length > 0 ? students : defaultStudents
  ).filter((student) => {
    const name = student.Name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Container className="mt-5">
      <div>
        <Breadcrumb>
          <Breadcrumb.Item active>Student List</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="mb-5">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center w-100">
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
              <div>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={handleButtonClick}
                >
                  Import Student List
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </Card.Header>

          <Card.Body>
            <div style={{ height: "700px", overflowY: "auto" }}>
              {filteredStudents.length === 0 ? (
                <p className="text-center text-muted">No students found.</p>
              ) : (
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
                        <td>{student.Name}</td>
                        <td>{student["ID number"]}</td>
                        <td>{student["Course/Year"]}</td>
                        <td>{student["School year"]}</td>
                        <td>{student.Semester}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default StudentList;
