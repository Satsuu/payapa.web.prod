import React, { useState } from "react";
import "../index.css";

import { Container, Breadcrumb, Card, Table, Button } from "react-bootstrap";
import useFetchUsers from "../hooks/useFetchUsers";
import useStatus from "../hooks/useStatus";
import useAverageStatus from "../hooks/useAverageStatus";
import FilterDropdown from "../components/CourseFilter";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Tooltip from "@mui/material/Tooltip";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Student() {
  const { users } = useFetchUsers();
  const { labels } = useStatus();
  const { score } = useAverageStatus();
  const [selectedCourse, setSelectedCourse] = useState("");

  const handleFilterSelect = (course) => {
    setSelectedCourse(course);
  };

  const filteredUsers = selectedCourse
    ? users.filter((user) => user.course === selectedCourse)
    : users;

  const getStarIcons = (scoreValue) => {
    const stars = [];
    const maxStars = 5;
    const filledStars = Math.floor(scoreValue / 10);
    for (let i = 0; i < maxStars; i++) {
      stars.push(
        <Tooltip title={`Score: ${scoreValue}`} key={i}>
          {i < filledStars ? <StarIcon /> : <StarBorderIcon />}
        </Tooltip>
      );
    }
    return stars;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    html2canvas(document.querySelector("#students-table")).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      doc.save("students.pdf");
    });
  };

  return (
    <>
      <Container className="mt-5">
        <Breadcrumb className="cursor-pointer">
          <Breadcrumb.Item active>Student</Breadcrumb.Item>
        </Breadcrumb>

        <div>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                Students list
                <div>
                  <Button
                    variant="outline-primary"
                    onClick={downloadPDF}
                    className="me-2"
                    size="sm"
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Table
                className="cursor-pointer"
                id="students-table"
                bordered
                hover
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th className="d-flex justify-content-between">
                      Course
                      <FilterDropdown onSelect={handleFilterSelect} />
                    </th>
                    <th>Status</th>
                    <th>Ave Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const userLabel = labels.find(
                      (labelData) => labelData.id === user.id
                    );
                    const userScore = score.find(
                      (scoreData) => scoreData.id === user.id
                    );

                    return (
                      <tr key={user.id}>
                        <td>{`${user.firstName} ${user.lastName}`}</td>
                        <td>{user.studentID}</td>
                        <td>{user.course}</td>
                        <td>{userLabel ? userLabel.label : "No Status"}</td>
                        <td className="text-center">
                          {userScore
                            ? getStarIcons(userScore.score)
                            : "No Average Status"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}

export default Student;
