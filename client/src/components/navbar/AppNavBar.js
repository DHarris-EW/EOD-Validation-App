import React  from "react"

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {Link} from "react-router-dom";

export default function AppNavBar() {

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/login">Validation App</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}
