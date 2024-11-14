import { Modal, Button } from "react-bootstrap";

function DetailsModal({ show, onHide, user }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <div>
            <p>
              <strong>First Name:</strong> {user.firstName}
            </p>
            <p>
              <strong>Middle Name:</strong> {user.middleName}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastName}
            </p>
            <p>
              <strong>Age:</strong> {user.age}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender}
            </p>
            <p>
              <strong>Address:</strong> {user.homeAddress}
            </p>
            <p>
              <strong>Email Address:</strong> {user.emailAddress}
            </p>
            <p>
              <strong>Facebook Link:</strong> {user.fbLink}
            </p>
            <p>
              {user.course ? (
                <>
                  <strong>Course:</strong> {user.course}
                </>
              ) : user.department ? (
                <>
                  <strong>Department:</strong> {user.department}
                </>
              ) : (
                <strong>Not available</strong>
              )}
            </p>
            <p>
              <strong>Year Level:</strong> {user.year}
            </p>
            <p>
              <strong>Student Number:</strong> {user.studentId}
            </p>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DetailsModal;
