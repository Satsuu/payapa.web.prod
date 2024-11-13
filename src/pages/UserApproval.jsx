import { Breadcrumb, Container } from "react-bootstrap";

function UserApproval() {
  return (
    <>
      <Container className="mt-5">
        <Breadcrumb>
          <Breadcrumb.Item active>User Approval</Breadcrumb.Item>
        </Breadcrumb>
      </Container>
    </>
  );
}

export default UserApproval;
