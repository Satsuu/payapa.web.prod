import { Container, Card, Form, Button } from "react-bootstrap";
import "../index.css";
import useLogin from "../hooks/useLogin";

function LoginPage() {
  const { email, setEmail, password, setPassword, handleLogin } = useLogin();
  return (
    <div>
      <Container className="centered">
        <Card className="glass-morphism py-5" style={{ width: "28rem" }}>
          <Card.Body>
            <Card.Title className="text-center text-dark mb-5">
              <b>Administrator Login</b>
            </Card.Title>
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-3">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default LoginPage;
