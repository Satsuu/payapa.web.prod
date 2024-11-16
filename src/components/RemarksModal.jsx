import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";

function RemarksModal({ show, handleClose, appointment, onSubmit }) {
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    if (!remarks.trim()) {
      toast.error("Remarks cannot be empty.");
      return;
    }
    onSubmit(remarks);
    setRemarks("");
    handleClose();
  };

  const handleCloseModal = () => {
    setRemarks("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Finish Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="remarksInput">
            <Form.Label>Counseling Remarks</Form.Label>
            <Form.Control
              as="textarea"
              required
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks about the session"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!remarks.trim()}
        >
          Submit
        </Button>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RemarksModal;
