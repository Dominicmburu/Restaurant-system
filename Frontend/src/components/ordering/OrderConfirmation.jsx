import React from 'react';
import { Container, Button, Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaMotorcycle, 
  FaHome, 
  FaStore, 
  FaClock, 
  FaUtensils, 
  FaTruck, 
  FaEnvelope,
  FaPhoneAlt,
  FaShoppingBasket
} from 'react-icons/fa';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNumber, orderDetails } = location.state || {};
  
  const { order = {}, customer = {} } = orderDetails || {};
  const { orderItems = [], orderType, total, restaurant } = order;
  
  const getEstimatedTime = () => {
    return orderType === 'DELIVERY' 
      ? '30-45 minutes' 
      : '15-20 minutes';
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card 
            className="shadow-lg border-0" 
            style={{ 
              borderRadius: '20px', 
              overflow: 'hidden' 
            }}
          >
            {/* Header Section */}
            <div 
              className="bg-warning text-center p-4" 
              style={{ 
                background: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)' 
              }}
            >
              <FaCheckCircle 
                className="text-white mb-3" 
                size={80} 
                style={{ 
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' 
                }} 
              />
              <h2 className="text-white fw-bold mb-2">Order Confirmed!</h2>
              <h5 className="text-white-50">Order #{orderNumber}</h5>
            </div>

            {/* Order Details */}
            <Card.Body className="p-4">
              <Row>
                <Col md={7}>
                  <h4 className="mb-3">
                    <FaShoppingBasket className="me-2 text-warning" />
                    Order Summary
                  </h4>
                  <ListGroup variant="flush">
                    {orderItems.map((item, index) => (
                      <ListGroup.Item 
                        key={index} 
                        className="d-flex justify-content-between align-items-center px-0"
                      >
                        <div>
                          <span className="fw-bold">{item.menuItem.name}</span>
                          {item.notes && (
                            <Badge 
                              bg="light" 
                              text="dark" 
                              className="ms-2"
                            >
                              {item.notes}
                            </Badge>
                          )}
                          <div className="text-muted small">
                            {item.quantity} × £{parseFloat(item.price).toFixed(2)}
                          </div>
                        </div>
                        <span className="fw-bold">
                          £{(item.quantity * parseFloat(item.price)).toFixed(2)}
                        </span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  <div className="mt-3 border-top pt-3">
                    <div className="d-flex justify-content-between">
                      <span>Subtotal</span>
                      <span>£{parseFloat(total).toFixed(2)}</span>
                    </div>
                    {orderType === 'DELIVERY' && (
                      <div className="d-flex justify-content-between">
                        <span>Delivery Fee</span>
                        <span>£2.99</span>
                      </div>
                    )}
                    <div 
                      className="d-flex justify-content-between fw-bold mt-2 pt-2 border-top"
                    >
                      <span>Total</span>
                      <span>£{parseFloat(total).toFixed(2)}</span>
                    </div>
                  </div>
                </Col>

                <Col md={5}>
                  <Card className="bg-light border-0 mb-3">
                    <Card.Body>
                      <h5 className="mb-3">
                        <FaStore className="me-2 text-warning" />
                        Restaurant Details
                      </h5>
                      <div>
                        <strong>{restaurant?.name}</strong>
                        <p className="text-muted small mb-1">
                          {restaurant?.address}
                        </p>
                        <p className="text-muted small">
                          {restaurant?.phone}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>

                  <Card className="bg-light border-0">
                    <Card.Body>
                      <h5 className="mb-3">
                        <FaClock className="me-2 text-warning" />
                        Order Timing
                      </h5>
                      <div>
                        <strong>
                          {orderType === 'DELIVERY' ? 'Delivery' : 'Pickup'} Time
                        </strong>
                        <p className="text-muted small">
                          Estimated: {getEstimatedTime()}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>

            {/* Footer Actions */}
            <Card.Footer className="bg-white p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <FaEnvelope className="me-2 text-muted" />
                  Confirmation sent to: {customer.email}
                </div>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/')}
                  >
                    <FaHome className="me-1" /> Home
                  </Button>
                  <Button 
                    variant="warning" 
                    onClick={() => navigate('/menu')}
                  >
                    Order Again
                  </Button>
                </div>
              </div>
            </Card.Footer>
          </Card>

          {/* Additional Information */}
          <Card className="mt-4 border-0 bg-light">
            <Card.Body>
              <h5 className="mb-3">Need Help?</h5>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <FaPhoneAlt className="me-2 text-warning" />
                  Customer Support: 0121 234 5678
                </div>
                <Button variant="outline-warning">
                  Contact Support
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmation;