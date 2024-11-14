import { Breadcrumb, Card, Container, Table, Spinner } from "react-bootstrap";
function History() {
  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item active>Appointment History</Breadcrumb.Item>
      </Breadcrumb>

      <div>
        <Card>
          <Card.Body>
            <Table className="cursor-pointer" bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Start of Counseling</th>
                  <th>End of Counseling</th>
                  <th>Remarks</th>
                </tr>
              </thead>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default History;
