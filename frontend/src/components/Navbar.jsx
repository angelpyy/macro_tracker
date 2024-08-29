import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import "bootstrap/dist/css/bootstrap.min.css";

export default function MacroNavbar() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error('logout failed', error);
    }
  };
  
	return (
    <Navbar className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">meowcro</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
          </Nav>
          {isAuthenticated && (
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
	);
}