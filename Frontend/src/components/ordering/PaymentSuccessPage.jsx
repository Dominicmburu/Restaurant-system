import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle, FaHome } from 'react-icons/fa';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get the session ID from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const sessionId = queryParams.get('session_id');
        
        // If no session ID in URL, try retrieving from localStorage
        const storedSessionId = localStorage.getItem('pendingSessionId');
        const orderId = localStorage.getItem('pendingOrderId');
        
        if (!sessionId && !storedSessionId) {
          throw new Error('No payment session found');
        }

        // Verify the session with our backend
        const response = await axios.get(`${API_BASE_URL}/payments/verify-session/${sessionId || storedSessionId}`);
        
        if (response.data.success && response.data.data.isComplete) {
          // Payment was successful
          setOrderDetails(response.data.data.order);
          
          // Confirm payment success on our backend if not already confirmed
          if (orderId) {
            await axios.post(`${API_BASE_URL}/orders/${orderId}/payment-success`, {
              session_id: sessionId || storedSessionId
            });
          }
          
          // Clear localStorage
          localStorage.removeItem('pendingOrderId');
          localStorage.removeItem('pendingSessionId');
        } else {
          throw new Error('Payment not completed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError('Unable to verify payment. Please contact customer support.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3">Verifying your payment...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Card className="p-4 shadow-sm border-0">
          <Card.Body className="text-center">
            <FaExclamationTriangle size={60} className="text-danger mb-3" />
            <h2>Payment Verification Failed</h2>
            <p className="text-muted">{error}</p>
            <Button 
              variant="warning" 
              className="mt-3"
              onClick={() => navigate('/')}
            >
              <FaHome className="me-2" /> Return to Home
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-sm border-0">
        <Card.Body className="text-center">
          <FaCheckCircle size={80} className="text-success mb-4" />
          <h2 className="fw-bold">Payment Successful!</h2>
          <p className="lead">Thank you for your order</p>
          
          {orderDetails && (
            <div className="mt-4 text-start">
              <h5>Order Details:</h5>
              <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
              <p><strong>Total:</strong> £{parseFloat(orderDetails.total).toFixed(2)}</p>
              <p><strong>Estimated {orderDetails.orderType === 'DELIVERY' ? 'Delivery' : 'Pickup'} Time:</strong> {
                orderDetails.orderType === 'DELIVERY' ? '30-45 minutes' : '15-20 minutes'
              }</p>
              <p className="mb-4"><strong>Restaurant:</strong> {orderDetails.restaurant.name}</p>
              
              <p className="text-muted">
                We've sent a confirmation email to your provided email address with all the details.
              </p>
            </div>
          )}
          
          <div className="mt-4">
            <Button 
              variant="warning" 
              className="me-2"
              onClick={() => navigate('/')}
            >
              <FaHome className="me-2" /> Return to Home
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentSuccessPage;