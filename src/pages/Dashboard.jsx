import { useEffect, useState } from "react";
import "../index.css";
import {
  Container,
  Breadcrumb,
  Card,
  Row,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";

import { toast } from "react-toastify";
import UserDetailsModal from "../components/UserDetailsModal";

import { firestore } from "../services/Firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import useFetchUsers from "../hooks/useFetchUsers";

function Dashboard() {
  const { users, loading, error } = useFetchUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 986);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(isMobile);
  };

  const handleApprove = async () => {
    if (selectedUser) {
      const userRef = doc(firestore, "users", selectedUser.id);
      await updateDoc(userRef, { isAccountValidated: true });
      toast.success("User approved!");
      setShowModal(false);
    }
  };

  const handleDecline = async () => {
    if (selectedUser) {
      const userRef = doc(firestore, "users", selectedUser.id);
      await deleteDoc(userRef);
      toast.error("User declined and removed from the database.");

      users((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );

      setSelectedUser(null);
      setShowModal(false);
    }
  };

  return (
    <>
      <Container className="mt-5">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>
            Dashboard
          </Breadcrumb.Item>
        </Breadcrumb>

        {loading && <Spinner animation="border" />}

        <div>
          {!loading && !error && (
            <Row style={{ height: "800px" }}>
              <Col sm={4} style={{ maxHeight: "100%", overflowY: "auto" }}>
                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="mb-3"
                    onClick={() => handleUserClick(user)}
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Body>
                      <h4>{`${user.firstName} ${user.lastName}`}</h4>
                      <p className="text-muted">{user.email}</p>
                    </Card.Body>
                  </Card>
                ))}
              </Col>

              {!isMobile && (
                <Col sm={8}>
                  <Row>
                    <div className="mb-3">
                      <Card>
                        <Card.Header>
                          {selectedUser ? (
                            <>
                              <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">{`${selectedUser.firstName} ${selectedUser.lastName}`}</h4>
                                <div>
                                  <Button
                                    variant="success"
                                    className="me-2"
                                    onClick={handleApprove}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="danger"
                                    onClick={handleDecline}
                                  >
                                    Decline
                                  </Button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p>Select a student to view details</p>
                          )}
                        </Card.Header>
                      </Card>
                    </div>

                    {selectedUser && (
                      <div>
                        <Card>
                          <Card.Body>
                            <Row>
                              <Col
                                sm={4}
                                className="d-flex justify-content-center align-items-center"
                              >
                                {isImageLoading && (
                                  <Spinner animation="border" role="status">
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </Spinner>
                                )}
                                <img
                                  src={selectedUser.photoUrl}
                                  alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                  onLoad={() => setIsImageLoading(false)}
                                />
                              </Col>

                              <Col sm={8}>
                                <p>
                                  <strong>Age:</strong> {selectedUser.age}
                                </p>
                                <p>
                                  <strong>Course:</strong> {selectedUser.course}
                                </p>
                                <p>
                                  <strong>Email:</strong> {selectedUser.email}
                                </p>
                                <p>
                                  <strong>Gender:</strong> {selectedUser.gender}
                                </p>
                                <p>
                                  <strong>Nickname:</strong>{" "}
                                  {selectedUser.nickname}
                                </p>
                                <p>
                                  <strong>Student ID:</strong>
                                  {selectedUser.studentID}
                                </p>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                    )}
                  </Row>
                </Col>
              )}
            </Row>
          )}
        </div>
      </Container>

      <UserDetailsModal
        show={showModal}
        onHide={() => setShowModal(false)}
        user={selectedUser}
        onApprove={handleApprove}
        onDecline={handleDecline}
        isImageLoading={isImageLoading}
        setIsImageLoading={setIsImageLoading}
      />
    </>
  );
}

export default Dashboard;
