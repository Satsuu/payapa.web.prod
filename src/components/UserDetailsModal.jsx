import React from "react";
import { Modal, Button, Row, Col, Spinner } from "react-bootstrap";

const UserDetailsModal = ({
  show,
  onHide,
  user,
  onApprove,
  onDecline,
  isImageLoading,
  setIsImageLoading,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {user ? `${user.firstName} ${user.lastName}` : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user && (
          <Row>
            <Col
              md={4}
              className="d-flex justify-content-center align-items-center"
            >
              {isImageLoading && (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
              <img
                src={user.photoUrl}
                alt={`${user.firstName} ${user.lastName}`}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                onLoad={() => setIsImageLoading(false)}
              />
            </Col>

            <Col md={8}>
              <p>
                <strong>Age:</strong> {user.age}
              </p>
              <p>
                <strong>Course:</strong> {user.course}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Gender:</strong> {user.gender}
              </p>
              <p>
                <strong>Nickname:</strong> {user.nickname}
              </p>
              <p>
                <strong>Student ID:</strong>
                {user.studentID}
              </p>
            </Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={onApprove}>
          Approve
        </Button>
        <Button variant="danger" onClick={onDecline}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailsModal;
