import React, { useState } from "react";
import "../index.css";

import {
  Container,
  Breadcrumb,
  Row,
  Col,
  Card,
  Spinner,
  Button,
  Form,
} from "react-bootstrap";

import useAppointments from "../hooks/useAppointments";
import useSaveAppointment from "../hooks/useSaveAppointment";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";

function Appointments() {
  const { appointments = [], loading, error } = useAppointments();
  const {
    saveAppointment,
    loading: savingLoading,
    error: savingError,
  } = useSaveAppointment();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentMessage, setAppointmentMessage] = useState("");

  const handleUserClick = (appointment) => {
    setSelectedUser(appointment.user);
    console.log("Selected User:", appointment.user);
  };

  const handleSetAppointmentClick = () => {
    setShowAppointmentForm(!showAppointmentForm);
  };

  const handleConfirmAppointment = async () => {
    if (selectedUser) {
      if (!appointmentDate || !appointmentTime || !appointmentMessage) {
        toast.error("Please fill in all the fields.");
        return;
      }

      const appointmentData = {
        userId: selectedUser.uid,
        date: appointmentDate,
        time: appointmentTime,
        message: appointmentMessage,
      };

      const success = await saveAppointment(appointmentData);
      if (success) {
        toast.success("The appointment has been successfully scheduled");
        setShowAppointmentForm(false);
        setAppointmentDate("");
        setAppointmentTime("");
        setAppointmentMessage("");
      } else if (savingError) {
        toast.error("Failed to save appointment. Please try again.");
      }
    } else {
      toast.error("Please select a user to schedule an appointment.");
    }
  };
  return (
    <>
      <Container className="mt-5">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>
            Appointments
          </Breadcrumb.Item>
        </Breadcrumb>

        {loading && <Spinner animation="border" />}

        <div>
          {!loading && !error && (
            <Row>
              <Col sm={4}>
                {appointments
                  .filter((appointment) => appointment.user)
                  .map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="mb-3 cursor-pointer"
                      onClick={() => handleUserClick(appointment)}
                    >
                      <Card.Body>
                        {appointment.user ? (
                          <>
                            <h4>{`${appointment.user.firstName} ${appointment.user.lastName}`}</h4>
                            <p className="text-muted">
                              {appointment.user.email}
                            </p>
                          </>
                        ) : (
                          <p>No user found for this appointment</p>
                        )}
                      </Card.Body>
                    </Card>
                  ))}
              </Col>

              <Col sm={8}>
                <div>
                  <Card>
                    <Card.Header>
                      {selectedUser ? (
                        <>
                          <div className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">{`${selectedUser.firstName} ${selectedUser.lastName}`}</h4>
                            <div>
                              <Button
                                variant="outline-secondary"
                                className="me-2 d-flex justify-content-between align-items-center"
                                size="sm"
                                onClick={handleSetAppointmentClick}
                              >
                                <AddIcon className="me-2" /> Set Appointment
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
                <Row className="mt-3">
                  <Col>
                    <Card>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>Message</strong>
                        </div>
                        {selectedUser && selectedUser.reasonForStress ? (
                          <textarea
                            value={selectedUser.reasonForStress}
                            disabled
                            style={{ width: "100%" }}
                          />
                        ) : (
                          <p>No reason for stress provided</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  {showAppointmentForm && (
                    <Col>
                      <Card>
                        <Card.Body>
                          <Form>
                            <Form.Group controlId="appointmentDate">
                              <Form.Label>Appointment Date</Form.Label>
                              <Form.Control
                                type="date"
                                value={appointmentDate}
                                onChange={(e) =>
                                  setAppointmentDate(e.target.value)
                                }
                                required
                              />
                            </Form.Group>
                            <Form.Group
                              controlId="appointmentTime"
                              className="mt-3"
                            >
                              <Form.Label>Appointment Time</Form.Label>
                              <Form.Control
                                type="time"
                                value={appointmentTime}
                                onChange={(e) =>
                                  setAppointmentTime(e.target.value)
                                }
                                required
                              />
                            </Form.Group>
                            <Form.Group
                              controlId="appointmentMessage"
                              className="mt-3"
                            >
                              <Form.Label>Appointment Message</Form.Label>
                              <Form.Control
                                as="textarea"
                                value={appointmentMessage}
                                onChange={(e) =>
                                  setAppointmentMessage(e.target.value)
                                }
                                required
                              />
                            </Form.Group>
                            <div className="d-flex justify-content-end">
                              <Button
                                variant="primary"
                                className="mt-3"
                                size="sm"
                                onClick={handleConfirmAppointment}
                              >
                                {savingLoading ? (
                                  <>
                                    <Spinner animation="border" />
                                  </>
                                ) : (
                                  "Confirm Appointment"
                                )}
                              </Button>
                            </div>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          )}
        </div>
      </Container>
    </>
  );
}

export default Appointments;
