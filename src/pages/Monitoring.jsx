import { useState, useMemo } from "react";
import {
  Breadcrumb,
  Container,
  Table,
  Spinner,
  Alert,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import useFetchUsers from "../hooks/useFetchUsers";
import MonitoringModal from "../components/MonitoringModal";
import useFetchSentiment from "../hooks/useFetchSentiment";
import useAverageStatus from "../hooks/useAverageStatus";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function Monitoring() {
  const { users, loading: usersLoading, error: usersError } = useFetchUsers();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { score } = useAverageStatus();

  const userIds = useMemo(() => users.map((user) => user.id), [users]);

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

    return <div style={{ display: "flex", justifyContent: "center" }}>{stars}</div>;
  };

  const findUserScore = (userId) => {
    const userScore = score.find((s) => s.id === userId);
    return userScore ? userScore.score : null;
  };

  return (
    <>
      <Container className="mt-5">
        <Breadcrumb>
          <Breadcrumb.Item active>Students / Employee</Breadcrumb.Item>
        </Breadcrumb>
        <h5>Student Employee List</h5>
        <hr />
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
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>Course</th>
                <th>Details</th>
                <th>Sentiment Analysis</th>
                <th>Psychological Assessment</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userScore = findUserScore(user.id);
                return (
                  <tr key={user.id}>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>{user.studentID}</td>
                    <td>{user.course}</td>
                    <td>
                      <Button
                        variant="info"
                        onClick={() => handleShowModal(user)}
                      >
                        View Details
                      </Button>
                    </td>
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
                    <td>
                      <Button variant="info" onClick={() => {}}>
                        Update
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
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
