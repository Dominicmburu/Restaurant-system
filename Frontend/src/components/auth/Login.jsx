import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      
      if (response.data.success) {
        const { token, data } = response.data;
        
        // Store token and user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
        
        // Redirect based on user role
        if (data.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (data.role === 'MANAGER') {
          navigate('/manager/dashboard');
        } else {
          navigate('/user/profile');
        }
      } else {
        setError('Invalid login credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        padding: '2rem 0',
        background: 'linear-gradient(to right, #f8f9fa, #e9ecef)'
      }}
    >
      <Card className="p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }}>
        <h3 className="text-center fw-bold mb-3 text-primary">Restaurant Management</h3>
        <p className="text-center text-muted">Sign in to continue</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
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
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </Form>

        <div className="text-center mt-4">
          <p className="text-muted mb-0 small">
            For admin access: admin@turknazz.com / adminpassword
          </p>
        </div>

        <div className="text-center mt-3">
          <Button 
            variant="link" 
            className="text-decoration-none p-0"
            onClick={() => navigate('/')}
          >
            Back to Homepage
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;