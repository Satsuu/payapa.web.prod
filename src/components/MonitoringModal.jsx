import React from 'react'
import { Modal, Button } from 'react-bootstrap'

function MonitoringModal({ show, user, onClose }) {
  if (!user) return null

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <img
            src={user.photoUrl}
            alt="User Profile"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
        </div>
        <p>
          <strong>First Name:</strong> {user.firstName}
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
          <strong>Address:</strong> {user.address}
        </p>
        <p>
          <strong>Contact Number:</strong> {user.contactNumber}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Facebook:</strong> {user.fb}
        </p>
        <p>
          <strong>Course:</strong> {user.course}
        </p>
        <p>
          <strong>Year Level:</strong> {user.yearLevel}
        </p>
        <p>
          <strong>Student ID:</strong> {user.studentID}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MonitoringModal
