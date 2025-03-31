import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isHomePage = location.pathname === '/';

  const navbarBg = isHomePage && !scrolled ? 'transparent' : 'dark';
  const navbarVariant = isHomePage && !scrolled ? 'light' : 'dark';
  const navbarPosition = isHomePage ? 'fixed-top' : '';
  const textClass = isHomePage && !scrolled ? 'text-light' : 'text-light';

  return (
    <Navbar
      bg={navbarBg}
      variant={navbarVariant}
      expand="lg"
      className={`py-3 ${navbarPosition} transition-all w-100`}
      style={{
        boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className={`d-flex align-items-center ${textClass}`}>
          <div className="bg-warning text-dark p-2 rounded me-2">
            <h4 className="mb-0 fw-bold">TurkNazz</h4>
          </div>
          <span className="d-none d-md-inline fw-bold">Authentic Turkish Cuisine</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
          <i className="bi bi-list fs-4"></i>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={`mx-2 ${location.pathname === '/' ? 'fw-bold text-warning' : textClass}`}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/menu"
              className={`mx-2 ${location.pathname === '/menu' ? 'fw-bold text-warning' : textClass}`}
            >
              Menu
            </Nav.Link>
            {/* <Nav.Link
              as={Link}
              to="/checkout"
              className={`mx-2 ${location.pathname === '/checkout' ? 'fw-bold text-warning' : textClass}`}
            >
              Checkout
            </Nav.Link> */}
            <Nav.Link
              as={Link}
              to="/booking"
              className={`mx-2 ${location.pathname === '/booking' ? 'fw-bold text-warning' : textClass}`}
            >
              Book a Table
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              className={`mx-2 ${location.pathname === '/about' ? 'fw-bold text-warning' : textClass}`}
            >
              About Us
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contact"
              className={`mx-2 ${location.pathname === '/contact' ? 'fw-bold text-warning' : textClass}`}
            >
              Contact
            </Nav.Link>
          </Nav>

          {/* <div className="d-flex align-items-center">
            {!user ? (
              <div>
                <Button
                  variant="outline-warning"
                  as={Link}
                  to="/login"
                  className="me-2 px-3"
                >
                  Login
                </Button>
                <Button
                  variant="warning"
                  as={Link}
                  to="/register"
                  className="px-3 text-dark fw-bold"
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant={isHomePage && !scrolled ? "light" : "dark"}
                  id="dropdown-basic"
                  className="d-flex align-items-center border-0 bg-dark shadow-none"
                >
                  <div className="me-2 rounded-circle bg-warning d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}>
                    <span className="fw-bold text-dark">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className={textClass}>{user.name || 'User'}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="border-0 shadow mt-2"
                  popperConfig={{
                    modifiers: [
                      {
                        name: 'preventOverflow',
                        options: {
                          boundary: document.body,
                        },
                      },
                    ],
                  }}
                  style={{
                    zIndex: 9999,
                  }}
                >
                  <Dropdown.Item as={Link} to="/admin/dashboard">
                    <i className="bi bi-speedometer2 me-2"></i>Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person me-2"></i>My Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/cart">
                    <i className="bi bi-cart me-2"></i>My Cart
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/order">
                    <i className="bi bi-bag me-2"></i>My Orders
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout} className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
