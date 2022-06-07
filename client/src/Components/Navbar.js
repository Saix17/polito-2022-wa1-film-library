import React from 'react';
import { Form, Container, Navbar } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';

const MyNavbar = () => {
  return (
    <Navbar bg="primary" variant="dark" className="Navbar">
      <Container fluid>
        <Navbar.Brand >
          <NavLink to="/" className="logo">
            <img
              src="/logo192.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React logo"
            />
            Film Library
          </NavLink>

        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-center">
          <Navbar.Text>
            <Form.Control
              type="text"
              id="search"
              placeholder='Search'
            />
          </Navbar.Text>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <PersonCircle color="white" size={32} />
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export { MyNavbar };