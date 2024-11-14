import { Button, Card, Table } from "react-bootstrap";

function ScheduledAppointmentTable({ appointments, selectedUser }) {
  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB - dateA;
  });

  return (
    <Card>
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
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.message}</td>
                  <td>{appointment.respond}</td>
                  <td className="text-center">
                    <Button
                      variant="success"
                      size="sm"
                      disabled={appointment.respond === "Pending"}
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
