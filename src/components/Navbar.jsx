import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import AccountCircle from "@mui/icons-material/AccountCircle";
import "../index.css";
import { toast } from "react-toastify";

import { useUser } from "../services/UserContext";
import { auth } from "../services/Firebase";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

function NavigationBar() {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, setCurrentUser } = useUser();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 986;
      setIsMobile(mobile);
      console.log("Is mobile:", mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate("/");
      toast.success("Logout successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  const popover = (
    <Popover id="popover-basic" style={{ minWidth: "200px" }}>
      <Popover.Header as="h3">
        {currentUser && (
          <b className="text-dark cursor-pointer">{currentUser.email}</b>
        )}
      </Popover.Header>
      <Popover.Body>
        <Nav.Link onClick={handleLogout} className="text-danger">
          <b>Logout</b>
        </Nav.Link>
      </Popover.Body>
    </Popover>
  );

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/dashboard">
          <b>Payapa.</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto breadcrumb-nav d-flex align-items-center">
            <Nav.Link
              as={Link}
              to="/dashboard"
              active={location.pathname === "/dashboard"}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/student"
              active={location.pathname === "/student"}
            >
              Students
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/appointments"
              active={location.pathname === "/appointments"}
            >
              Appointments
            </Nav.Link>{" "}
          </Nav>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <Navbar.Text className="logout-mobile">
              {isMobile ? (
                <Nav.Link onClick={handleLogout}>
                  <b className="text-danger">Logout</b>
                </Nav.Link>
              ) : (
                <AccountCircle sx={{ width: "30px", height: "30px" }} />
              )}
            </Navbar.Text>
          </OverlayTrigger>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
