import { useState, useEffect } from "react";
import { Button, Card, Table, Form } from "react-bootstrap";
import useAppointmentHistory from "../hooks/useAppointmentHistory";
import { firestore } from "../services/Firebase";
import { doc, deleteDoc } from "firebase/firestore";

function ScheduledAppointmentTable({ appointments, selectedUser }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { saveAppointmentHistory, loading, error } = useAppointmentHistory();
  const [countAppointments, setCountAppointments] = useState([]);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    setCountAppointments(appointments);
  }, [appointments]);

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB - dateA;
  });

  const constructAppointmentHistoryData = (
    selectedUser,
    selectedAppointment,
    remarks
  ) => {
    const currentDate = new Date();
    const endDate = currentDate.toISOString().split("T")[0];
    const endTime = currentDate.toLocaleTimeString();

    const fullName =
      `${selectedUser.firstName} ${selectedUser.lastName}`.trim();

    console.log("full name: ", fullName);

    return {
      fullName: fullName,
      course: selectedUser.course,
      date: selectedAppointment.date,
      time: selectedAppointment.time,
      message: selectedAppointment.message,
      endDate: endDate,
      endTime: endTime,
      remarks: remarks,
    };
  };

  const handleSubmitRemarks = async (remarks) => {
    if (!selectedUser) {
      console.error("User data is missing");
      return;
    }

    if (!selectedAppointment) {
      console.error("Appointment data is missing");
      return;
    }

    const appointmentHistoryData = constructAppointmentHistoryData(
      selectedUser,
      selectedAppointment,
      remarks
    );

    try {
      const success = await saveAppointmentHistory(appointmentHistoryData);
      if (success) {
        console.log(
          "Appointment history saved successfully:",
          appointmentHistoryData
        );

        await deleteAppointment(selectedAppointment.id);
      }
    } catch (err) {
      console.error("Error saving appointment history:", err);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      const appointmentRef = doc(
        firestore,
        "scheduledAppointments",
        selectedUser.uid,
        "appointments",
        appointmentId
      );

      await deleteDoc(appointmentRef);

      console.log("Appointment deleted successfully!");

      const updatedAppointments = countAppointments.filter(
        (appointment) => appointment.id !== appointmentId
      );

      setCountAppointments(updatedAppointments);
      console.log("Remaining appointments:", updatedAppointments.length);

      if (updatedAppointments.length === 0) {
        const userAppointmentsRef = doc(
          firestore,
          "appointments",
          selectedUser.uid
        );

        await deleteDoc(userAppointmentsRef);
        console.log("All appointments deleted. User data removed.");
      }
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  const handleRemarksChange = (appointmentId, value) => {
    setRemarks((prevRemarks) => ({
      ...prevRemarks,
      [appointmentId]: value,
    }));
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <Card style={{ maxHeight: "370px", overflow: "auto" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <strong>Scheduled Appointments</strong>
        </div>
        {selectedUser && (
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Message</th>
                <th>Respond</th>
                <th>Consultation Summary</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  onClick={() => handleSelectAppointment(appointment)}
                >
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.message}</td>
                  <td>{appointment.respond}</td>
                  <td>
                    <Form.Control
                      as="textarea"
                      value={remarks[appointment.id] || ""}
                      onChange={(e) =>
                        handleRemarksChange(appointment.id, e.target.value)
                      }
                      placeholder="Enter remarks"
                    />
                  </td>
                  <td className="text-center">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() =>
                        handleSubmitRemarks(remarks[appointment.id])
                      }
                      disabled={
                        appointment.respond === "Pending" ||
                        !remarks[appointment.id]
                      }
                    >
                      Finish Appointment
                    </Button>
                  </td>
                </tr>
              ))}
              {sortedAppointments.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">
                    No scheduled appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default ScheduledAppointmentTable;
