import { Breadcrumb, Container } from "react-bootstrap";

function Monitoring() {
  return (
    <>
      <Container className="mt-5">
        <Breadcrumb>
          <Breadcrumb.Item active>Monitoring</Breadcrumb.Item>
        </Breadcrumb>
      </Container>
    </>
  );
}

export default Monitoring;
