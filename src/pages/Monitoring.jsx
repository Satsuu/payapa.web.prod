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
            <Card.Body>
              <Table bordered className="cursor-pointer">
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
