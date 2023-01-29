import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import  Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default function NavbarAuthed() {
    const { auth } = useAuth()

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="home">Validation App</Navbar.Brand>
                <Nav className="m-auto">
                     <NavDropdown title="Validation" id="navbarDropdown_1">
                         {auth.roles.includes("admin") &&
                         <NavDropdown.Item as={Link} to="/validation/create">Create Validation</NavDropdown.Item>
                         }
                         <NavDropdown.Item as={Link} to="/validation/assess">Assess Validation</NavDropdown.Item>
                     </NavDropdown>
                    <NavDropdown title="Portal" id="navbarDropdown_2">
                         {auth.roles.includes("admin") &&
                         <NavDropdown.Item as={Link} to={`/user/${auth.id}/admin-portal`}>Admin Portal</NavDropdown.Item>
                         }
                         <NavDropdown.Item as={Link} to={`/user/${auth.id}/portal`}>My Portal</NavDropdown.Item>
                     </NavDropdown>

                    {auth.roles.includes("admin") &&
                        <Nav.Link as={Link} to="/registration">Registration</Nav.Link>
                    }
                </Nav>
                <Nav>
                    <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}


