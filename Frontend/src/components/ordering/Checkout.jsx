import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Badge, Tab, Nav, Alert, Spinner } from 'react-bootstrap';
import { FaLocationArrow, FaCreditCard, FaMoneyBill, FaClock, FaUser, FaPhone, FaHome, FaMapMarkerAlt, FaCheck, FaStore, FaExclamationTriangle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], orderSummary = {} } = location.state || {};
  const { orderType, subtotal = 0, deliveryFee = 0, tip = 0, total = 0, location: restaurantLocation } = orderSummary;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    addressDetails: '',
    city: 'Birmingham',
    postcode: '',
    paymentMethod: 'card',
    deliveryTime: 'asap',
    scheduledTime: '',
    notes: '',
    selectedLocation: restaurantLocation ? restaurantLocation.name : ''
  });

  const [validated, setValidated] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [restaurantLocations, setRestaurantLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch restaurant locations from the API
  useEffect(() => {
    axios.get(`${API_BASE_URL}/restaurants`)
      .then(response => {
        if (response.data.success) {
          setRestaurantLocations(response.data.data);
        } else {
          console.error('Failed to fetch restaurant locations');
        }
      })
      .catch(error => {
        console.error('Error fetching restaurant locations:', error);
        setError('Unable to load restaurant locations. Please try again later.');
      });
  }, []);

  useEffect(() => {
    // If a location was passed from the previous page, set it
    if (restaurantLocation) {
      setFormData(prevData => ({
        ...prevData,
        selectedLocation: restaurantLocation.name
      }));
    }
  }, [restaurantLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear location error if a location is selected
    if (name === 'selectedLocation' && value) {
      setLocationError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Check if a restaurant location is selected
    if (!formData.selectedLocation) {
      setLocationError(true);
      e.stopPropagation();
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Find the full location object
    const selectedLocationObj = restaurantLocations.find(loc => loc.name === formData.selectedLocation);
    if (!selectedLocationObj) {
      setError('Selected restaurant location not found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          notes: item.notes || ''
        })),
        restaurantId: selectedLocationObj.id,
        orderType: orderType.toUpperCase(), // Convert to uppercase for backend enum
        deliveryFee: deliveryFee,
        tip: tip,
        address: formData.address,
        addressDetails: formData.addressDetails,
        city: formData.city,
        postcode: formData.postcode,
        scheduledTime: formData.deliveryTime === 'scheduled' ? formData.scheduledTime : null,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod.toUpperCase(), // Convert to uppercase for backend enum
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      };

      // Create order
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);

      if (response.data.success) {
        const { order, payment } = response.data.data;

        // Check if payment requires action (redirect to Stripe)
        if (payment.requiresAction) {
          // Save order ID in localStorage for retrieval after payment
          localStorage.setItem('pendingOrderId', order.id);
          localStorage.setItem('pendingSessionId', payment.sessionId);

          // Redirect to Stripe Checkout
          window.location.href = payment.url;
        } else {
          // For cash payments, go directly to confirmation
          navigate('/order-confirmation', {
            state: {
              orderNumber: order.orderNumber,
              orderDetails: {
                order,
                customer: formData
              }
            }
          });
        }
      } else {
        setError('Failed to create order. Please try again.');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.response?.data?.error || 'An error occurred while processing your order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="fw-bold mb-4">Checkout</h2>

      {error && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            {/* Restaurant Location Selection */}
            <Card className="mb-4 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <h5 className="mb-3">Select Restaurant Location</h5>
                {locationError && (
                  <Alert variant="danger" className="mb-3">
                    Please select a restaurant location.
                  </Alert>
                )}
                <Form.Group controlId="selectedLocation">
                  <Form.Label>Choose which TurkNazz location you'd like to order from</Form.Label>
                  <div className="mb-3">
                    {restaurantLocations.map((rest, index) => (
                      <Form.Check
                        key={index}
                        type="radio"
                        id={`location-${index}`}
                        name="selectedLocation"
                        value={rest.name}
                        label={
                          <div>
                            <strong>{rest.name}</strong>
                            <div className="text-muted small">{rest.address}, {rest.city} {rest.postcode}</div>
                          </div>
                        }
                        checked={formData.selectedLocation === rest.name}
                        onChange={handleChange}
                        className="mb-2"
                        isInvalid={locationError}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Contact Information */}
            <Card className="mb-4 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <h5 className="mb-3">Contact Information</h5>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="name">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        style={{ borderRadius: '10px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="phone">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                        style={{ borderRadius: '10px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid phone number.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email"
                        style={{ borderRadius: '10px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid email.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {orderType === 'delivery' && (
              <Card className="mb-4 shadow-sm" style={{ borderRadius: '15px' }}>
                <Card.Body>
                  <h5 className="mb-3">Delivery Address</h5>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Group controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Street address"
                          style={{ borderRadius: '10px' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide your address.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="addressDetails">
                        <Form.Label>Apartment, suite</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="addressDetails"
                          value={formData.addressDetails}
                          onChange={handleChange}
                          placeholder="Apartment, suite, unit, etc."
                          style={{ borderRadius: '10px' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          style={{ borderRadius: '10px' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="postcode">
                        <Form.Label>Postcode</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                          placeholder="Postcode"
                          style={{ borderRadius: '10px' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid postcode.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            <Card className="mb-4 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <h5 className="mb-3">
                  {orderType === 'delivery' ? 'Delivery Time' : 'Pickup Time'}
                </h5>
                <Form.Group className="mb-3">
                  <div className="d-flex flex-wrap gap-3">
                    <Form.Check
                      type="radio"
                      id="delivery-asap"
                      name="deliveryTime"
                      value="asap"
                      label={
                        <div className="d-flex align-items-center">
                          <FaClock className="me-2 text-warning" />
                          <span>As soon as possible</span>
                        </div>
                      }
                      checked={formData.deliveryTime === 'asap'}
                      onChange={handleChange}
                      className="custom-radio"
                    />
                    <Form.Check
                      type="radio"
                      id="delivery-scheduled"
                      name="deliveryTime"
                      value="scheduled"
                      label={
                        <div className="d-flex align-items-center">
                          <FaClock className="me-2 text-warning" />
                          <span>Schedule for later</span>
                        </div>
                      }
                      checked={formData.deliveryTime === 'scheduled'}
                      onChange={handleChange}
                      className="custom-radio"
                    />
                  </div>
                </Form.Group>

                {formData.deliveryTime === 'scheduled' && (
                  <Form.Group controlId="scheduledTime" className="mt-3">
                    <Form.Label>Select {orderType === 'delivery' ? 'delivery' : 'pickup'} time</Form.Label>
                    <Form.Control
                      required
                      type="datetime-local"
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleChange}
                      style={{ borderRadius: '10px' }}
                    />
                  </Form.Group>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <h5 className="mb-3">Payment Method</h5>
                <Nav variant="pills" className="mb-3">
                  <Nav.Item>
                    <Nav.Link
                      active={formData.paymentMethod === 'card'}
                      onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className="d-flex align-items-center"
                    >
                      <FaCreditCard className="me-2" /> Credit/Debit Card
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={formData.paymentMethod === 'cash'}
                      onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                      className="d-flex align-items-center"
                    >
                      <FaMoneyBill className="me-2" /> Cash on {orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                {formData.paymentMethod === 'card' && (
                  <div className="card-payment-info mt-3">
                    <Alert variant="info">
                      <FaCreditCard className="me-2" />
                      You'll be redirected to our secure payment provider after placing your order.
                    </Alert>
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <h5 className="mb-3">Additional Notes</h5>
                <Form.Group controlId="notes">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions or requests?"
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm position-sticky" style={{ top: '24px', borderRadius: '15px' }}>
              <Card.Header className="bg-white border-0 pt-3">
                <h5 className="mb-0">Order Summary</h5>
                {formData.selectedLocation && (
                  <div className="text-muted small d-flex align-items-center mt-1">
                    <FaStore className="me-1" /> {formData.selectedLocation}
                  </div>
                )}
              </Card.Header>
              <Card.Body className="px-0 pt-2">
                <ListGroup variant="flush">
                  {items.map((item, index) => (
                    <ListGroup.Item
                      key={`${item.id}-${index}`}
                      className="px-3 py-2 border-bottom d-flex justify-content-between"
                    >
                      <div>
                        <span className="fw-medium">
                          {item.quantity} × {item.name}
                        </span>
                        {item.notes && (
                          <div className="text-muted small mt-1">
                            <em>Notes: {item.notes}</em>
                          </div>
                        )}
                      </div>
                      <span className="fw-bold">£{(item.price * item.quantity).toFixed(2)}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <div className="px-3 pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Delivery Fee</span>
                      <span>£{deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  {parseFloat(tip) > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Tip</span>
                      <span>£{parseFloat(tip).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between fw-bold mt-2 pt-2 border-top">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="px-3 pt-4">
                  <Button
                    variant="warning"
                    type="submit"
                    className="w-100 py-2"
                    style={{ borderRadius: '30px' }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      By placing your order, you agree to our Terms of Service and Privacy Policy
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default CheckoutPage;