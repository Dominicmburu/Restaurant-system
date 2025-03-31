import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Nav, Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [addressData, setAddressData] = useState([
    { id: 1, title: 'Home', address: '123 Main St, Apt 4B, New York, NY 10001', isDefault: true },
    { id: 2, title: 'Work', address: '456 Business Ave, Suite 300, New York, NY 10002', isDefault: false }
  ]);

  // Mock order history data
  const [orderHistory, setOrderHistory] = useState([
    { 
      id: 'ORD-1001', 
      date: '2025-03-10', 
      total: 42.99, 
      status: 'Delivered',
      items: [
        { name: 'Chicken Biryani', quantity: 1, price: 18.99 },
        { name: 'Garlic Naan', quantity: 2, price: 3.50 },
        { name: 'Mango Lassi', quantity: 2, price: 4.99 }
      ]
    },
    { 
      id: 'ORD-987', 
      date: '2025-03-01', 
      total: 29.50, 
      status: 'Delivered',
      items: [
        { name: 'Veggie Pizza', quantity: 1, price: 15.99 },
        { name: 'Cheese Sticks', quantity: 1, price: 7.99 },
        { name: 'Soda', quantity: 1, price: 2.49 }
      ]
    }
  ]);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddressChange = (id, field, value) => {
    setAddressData(addressData.map(addr => 
      addr.id === id ? { ...addr, [field]: value } : addr
    ));
  };

  const handleSetDefaultAddress = (id) => {
    setAddressData(addressData.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleDeleteAddress = (id) => {
    setAddressData(addressData.filter(addr => addr.id !== id));
  };

  const addNewAddress = () => {
    const newId = Math.max(...addressData.map(addr => addr.id), 0) + 1;
    setAddressData([
      ...addressData, 
      { id: newId, title: 'New Address', address: '', isDefault: false }
    ]);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser({
        ...user,
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
      setLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: 'danger',
        text: 'New passwords do not match!'
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage({
        type: 'success',
        text: 'Password updated successfully!'
      });
      
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Please log in to view your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold">My Profile</h2>
      
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}
      
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col lg={3} md={4} sm={12} className="mb-4">
            <Card className="profile-sidebar shadow-sm">
              <Card.Body className="p-0">
                <div className="text-center p-4 bg-warning bg-opacity-25 border-bottom">
                  <div className="rounded-circle bg-warning d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: "80px", height: "80px" }}>
                    <span className="fw-bold fs-1 text-dark">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <h5 className="fw-bold mb-1">{formData.name || 'User'}</h5>
                  <p className="text-muted mb-0">{formData.email}</p>
                </div>
                
                <Nav variant="pills" className="flex-column mt-2">
                  <Nav.Item>
                    <Nav.Link eventKey="profile" className="rounded-0 ps-4">
                      <i className="bi bi-person me-2"></i> Profile Information
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="address" className="rounded-0 ps-4">
                      <i className="bi bi-geo-alt me-2"></i> Delivery Addresses
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="orders" className="rounded-0 ps-4">
                      <i className="bi bi-bag me-2"></i> Order History
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="password" className="rounded-0 ps-4">
                      <i className="bi bi-shield-lock me-2"></i> Change Password
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="preferences" className="rounded-0 ps-4">
                      <i className="bi bi-sliders me-2"></i> Preferences
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={9} md={8} sm={12}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    <h4 className="mb-4">Profile Information</h4>
                    <Form onSubmit={handleProfileUpdate}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled
                            />
                            <Form.Text className="text-muted">
                              Email cannot be changed
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control 
                              type="tel" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Default Address</Form.Label>
                            <Form.Control 
                              as="textarea" 
                              rows={2}
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <div className="d-flex justify-content-end mt-3">
                        <Button 
                          variant="warning" 
                          type="submit" 
                          className="px-4 text-dark fw-bold"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Updating...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="address">
                    <h4 className="mb-4">Delivery Addresses</h4>
                    
                    <div className="mb-4">
                      {addressData.map((address) => (
                        <Card key={address.id} className="mb-3 border shadow-sm">
                          <Card.Body>
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Address Label</Form.Label>
                                  <Form.Control 
                                    type="text" 
                                    value={address.title}
                                    onChange={(e) => handleAddressChange(address.id, 'title', e.target.value)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Full Address</Form.Label>
                                  <Form.Control 
                                    as="textarea" 
                                    rows={2}
                                    value={address.address}
                                    onChange={(e) => handleAddressChange(address.id, 'address', e.target.value)}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <Form.Check 
                                type="checkbox" 
                                id={`default-address-${address.id}`}
                                label="Set as default address"
                                checked={address.isDefault}
                                onChange={() => handleSetDefaultAddress(address.id)}
                              />
                              
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeleteAddress(address.id)}
                                disabled={address.isDefault}
                              >
                                <i className="bi bi-trash me-1"></i> Remove
                              </Button>
                            </div>
                            
                            {address.isDefault && (
                              <div className="mt-2">
                                <span className="badge bg-warning text-dark">Default Address</span>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="outline-secondary" 
                        onClick={addNewAddress}
                        className="me-2"
                      >
                        <i className="bi bi-plus-circle me-1"></i> Add New Address
                      </Button>
                      
                      <Button 
                        variant="warning" 
                        className="px-4 text-dark fw-bold"
                      >
                        Save All Addresses
                      </Button>
                    </div>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="orders">
                    <h4 className="mb-4">Order History</h4>
                    
                    {orderHistory.length > 0 ? (
                      <div className="order-history">
                        {orderHistory.map((order) => (
                          <Card key={order.id} className="mb-4 border shadow-sm">
                            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                              <div>
                                <strong>Order #{order.id}</strong>
                                <span className="ms-3 text-muted">{new Date(order.date).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <span className={`badge bg-${order.status === 'Delivered' ? 'success' : 'warning'}`}>
                                  {order.status}
                                </span>
                              </div>
                            </Card.Header>
                            
                            <Card.Body>
                              <div className="mb-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="d-flex justify-content-between py-2 border-bottom">
                                    <div>
                                      <span>{item.name}</span>
                                      <span className="text-muted ms-2">x{item.quantity}</span>
                                    </div>
                                    <div>${(item.price * item.quantity).toFixed(2)}</div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="d-flex justify-content-between">
                                <div>
                                  <strong>Total</strong>
                                </div>
                                <div>
                                  <strong>${order.total.toFixed(2)}</strong>
                                </div>
                              </div>
                            </Card.Body>
                            
                            <Card.Footer className="bg-white d-flex justify-content-end">
                              <Button variant="outline-secondary" size="sm" className="me-2">
                                <i className="bi bi-receipt me-1"></i> Receipt
                              </Button>
                              
                              <Button variant="outline-warning" size="sm">
                                <i className="bi bi-arrow-repeat me-1"></i> Reorder
                              </Button>
                            </Card.Footer>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Alert variant="info">
                        You haven't placed any orders yet.
                      </Alert>
                    )}
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="password">
                    <h4 className="mb-4">Change Password</h4>
                    <Form onSubmit={handlePasswordChange}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          required
                        />
                        <Form.Text className="text-muted">
                          Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                        </Form.Text>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                      
                      <div className="d-flex justify-content-end mt-3">
                        <Button 
                          variant="warning" 
                          type="submit" 
                          className="px-4 text-dark fw-bold"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Updating...
                            </>
                          ) : (
                            'Update Password'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="preferences">
                    <h4 className="mb-4">Preferences</h4>
                    
                    <Card className="mb-4 border shadow-sm">
                      <Card.Body>
                        <h5 className="mb-3">Notification Settings</h5>
                        
                        <Form.Check 
                          type="switch"
                          id="email-notifications"
                          label="Email Notifications"
                          defaultChecked
                          className="mb-3"
                        />
                        
                        <Form.Check 
                          type="switch"
                          id="sms-notifications"
                          label="SMS Notifications"
                          defaultChecked
                          className="mb-3"
                        />
                        
                        <Form.Check 
                          type="switch"
                          id="promotional-emails"
                          label="Promotional Emails"
                          className="mb-3"
                        />
                        
                        <Form.Check 
                          type="switch"
                          id="order-updates"
                          label="Order Status Updates"
                          defaultChecked
                          className="mb-3"
                        />
                      </Card.Body>
                    </Card>
                    
                    <Card className="mb-4 border shadow-sm">
                      <Card.Body>
                        <h5 className="mb-3">Dietary Preferences</h5>
                        
                        <Row className="mb-3">
                          <Col md={4}>
                            <Form.Check 
                              type="checkbox"
                              id="vegetarian"
                              label="Vegetarian"
                              className="mb-2"
                            />
                          </Col>
                          
                          <Col md={4}>
                            <Form.Check 
                              type="checkbox"
                              id="vegan"
                              label="Vegan"
                              className="mb-2"
                            />
                          </Col>
                          
                          <Col md={4}>
                            <Form.Check 
                              type="checkbox"
                              id="gluten-free"
                              label="Gluten Free"
                              className="mb-2"
                            />
                          </Col>
                          
                          <Col md={4}>
                            <Form.Check 
                              type="checkbox"
                              id="dairy-free"
                              label="Dairy Free"
                              className="mb-2"
                            />
                          </Col>
                          
                          <Col md={4}>
                            <Form.Check 
                              type="checkbox"
                              id="nut-free"
                              label="Nut Free"
                              className="mb-2"
                            />
                          </Col>
                          
                          <Col md={4}>
                            <Form.Check 
                              type="checkbox"
                              id="low-carb"
                              label="Low Carb"
                              className="mb-2"
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                    
                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="warning" 
                        className="px-4 text-dark fw-bold"
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default Profile;