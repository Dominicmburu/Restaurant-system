import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { FaTimesCircle, FaShoppingCart, FaHome, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const PaymentCancelPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const cancelOrder = async () => {
      try {
        // Get the order ID from localStorage or URL query params
        const orderId = 
          localStorage.getItem('pendingOrderId') || 
          new URLSearchParams(location.search).get('order_id');
        
        if (orderId) {
          // Notify backend of the cancelled payment
          await axios.post(`${API_BASE_URL}/orders/${orderId}/payment-cancel`);
          
          // Clear localStorage
          localStorage.removeItem('pendingOrderId');
          localStorage.removeItem('pendingSessionId');
        }
      } catch (err) {
        console.error('Error cancelling order:', err);
        setError('Unable to cancel order. Please contact customer support.');
      }
    };
    
    cancelOrder();
  }, [location]);
  
  return (
    <Container className="py-5">
      <Card className="p-4 shadow-sm border-0">
        <Card.Body className="text-center">
          {error ? (
            <>
              <FaExclamationTriangle size={80} className="text-warning mb-4" />
              <h2 className="fw-bold">Cancellation Issue</h2>
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            </>
          ) : (
            <>
              <FaTimesCircle size={80} className="text-danger mb-4" />
              <h2 className="fw-bold">Payment Cancelled</h2>
              <p className="lead">Your order has been cancelled</p>
              <p className="text-muted mb-4">
                You can return to your cart to try again or continue shopping.
              </p>
            </>
          )}
          
          <div className="mt-4">
            <Button 
              variant="warning" 
              className="me-2"
              onClick={() => navigate('/menu')}
            >
              <FaShoppingCart className="me-2" /> Return to Menu
            </Button>
            <Button 
              variant="outline-secondary"
              onClick={() => navigate('/')}
            >
              <FaHome className="me-2" /> Go Home
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentCancelPage;