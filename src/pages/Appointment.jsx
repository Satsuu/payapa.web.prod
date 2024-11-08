import { useState } from "react";
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
import useUserDocument from "../hooks/useUserDocument";
import useFetchScheduledAppointment from "../hooks/useFetchScheduledAppointment";

import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import ScheduledAppointmentTable from "../components/ScheduledAppointment";

function Appointments() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { filteredAppointments, loading, error } = useAppointments();
  const {
    saveAppointment,
    loading: savingLoading,
    error: savingError,
  } = useSaveAppointment();
  const { userRole } = useUserDocument();
  const { scheduledAppointment } = useFetchScheduledAppointment(
    selectedUser?.uid
  );
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentMessage, setAppointmentMessage] = useState("");

  const displayedAppointments =
    userRole === "subadmin" ? filteredAppointments : filteredAppointments;

  const handleUserClick = (appointment) => {
    setSelectedUser(appointment.user);
    console.log("Selected User:", appointment.user);
    console.log("Selected User UID:", appointment.user.uid);
  };

  const handleSetAppointmentClick = () => {
    setShowAppointmentForm(!showAppointmentForm);
  };

  const isCurrentlyBusinessHours = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hours = now.getHours();

    return dayOfWeek >= 1 && dayOfWeek <= 5 && hours >= 8 && hours < 17;
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
                {displayedAppointments
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
                                disabled={!isCurrentlyBusinessHours()}
                                title={
                                  !isCurrentlyBusinessHours()
                                    ? "Appointments can only be set during business hours (Mon-Fri, 8 AM - 5 PM)"
                                    : ""
                                }
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
                    <Card className="h-100">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>Message</strong>
                        </div>
                        {selectedUser && selectedUser.reasonForStress ? (
                          <textarea
                            value={selectedUser.reasonForStress}
                            disabled
                            rows={10}
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
                      <Card className="h-100">
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
                {selectedUser && (
                  <Col className="mt-3">
                    <ScheduledAppointmentTable
                      appointments={scheduledAppointment}
                      selectedUser={selectedUser}
                    />
                  </Col>
                )}
              </Col>
            </Row>
          )}
        </div>
      </Container>
    </>
  );
}

export default Appointments;
