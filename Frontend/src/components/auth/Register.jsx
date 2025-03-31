import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '', name: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(credentials);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: '100vh',
      }}
    >
      <Card className="p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }}>
        <h3 className="text-center fw-bold mb-3 text-primary">Create an Account</h3>
        <p className="text-center text-muted">Join us today!</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={credentials.name}
              onChange={handleChange}
              required
              className="py-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="py-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Create a password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="py-2"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 fw-bold"
            style={{ borderRadius: '8px', transition: '0.3s' }}
          >
            Register
          </Button>
        </Form>

        <p className="text-center text-muted mt-3">
          Already have an account? <a href="/login" className="text-decoration-none fw-semibold">Login</a>
        </p>
      </Card>
    </div>
  );
};

export default Register;
