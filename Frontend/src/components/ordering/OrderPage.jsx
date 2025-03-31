import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ToggleButtonGroup, ToggleButton, Tab, Nav, Badge, ListGroup } from 'react-bootstrap';
import { FaHistory, FaShoppingBag, FaCheckCircle, FaClock, FaTruck, FaStore } from 'react-icons/fa';
import Menu from './Menu';
import Cart from './Cart';

// Sample order history data
const sampleOrderHistory = [
  {
    id: 'ORD-2024-001',
    date: '2024-03-10',
    time: '19:45',
    status: 'Delivered',
    type: 'delivery',
    total: 43.96,
    restaurant: 'Burger House',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 14.99 },
      { name: 'Chocolate Lava Cake', quantity: 2, price: 7.99 },
      { name: 'Soft Drinks', quantity: 4, price: 2.99 }
    ]
  },
  {
    id: 'ORD-2024-002',
    date: '2024-03-05',
    time: '13:20',
    status: 'Collected',
    type: 'pickup',
    total: 35.97,
    restaurant: 'Sushiteria',
    items: [
      { name: 'Grilled Salmon', quantity: 1, price: 19.99 },
      { name: 'Bruschetta', quantity: 1, price: 7.99 },
      { name: 'Fresh Juice', quantity: 1, price: 4.99 },
      { name: 'Garlic Bread', quantity: 1, price: 5.99 }
    ]
  },
  {
    id: 'ORD-2024-003',
    date: '2024-02-28',
    time: '20:15',
    status: 'Delivered',
    type: 'delivery',
    total: 39.97,
    restaurant: 'Happy Grill',
    items: [
      { name: 'Chicken Parmesan', quantity: 1, price: 16.99 },
      { name: 'Tiramisu', quantity: 1, price: 8.99 },
      { name: 'House Wine', quantity: 2, price: 6.99 }
    ]
  }
];

const OrderPage = () => {
  const [orderType, setOrderType] = useState('delivery');
  const [activeTab, setActiveTab] = useState('order');
  const [orderHistory, setOrderHistory] = useState(sampleOrderHistory);
  const [cartItems, setCartItems] = useState([]);
  
  // In a real app, you would fetch the order history from an API
  useEffect(() => {
    // Simulating fetching order history
    // setOrderHistory(fetchedOrderHistory);
  }, []);
  
  const handleTabChange = (value) => {
    setOrderType(value);
  };
  
  const handleMainTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Simulated cart functions
  const updateQuantity = (itemId, newQuantity) => {
    // Implementation would go here
    console.log(`Update item ${itemId} to quantity ${newQuantity}`);
  };
  
  const removeItem = (itemId) => {
    // Implementation would go here
    console.log(`Remove item ${itemId}`);
  };
  
  // Function to reorder from history
  const reorder = (order) => {
    // In a real app, this would add the items to the cart
    console.log(`Reordering ${order.id}`);
    setActiveTab('order');
    // Populate cart with items from the order
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Delivered':
        return <Badge bg="success" className="py-2 px-3 rounded-pill"><FaCheckCircle className="me-1" /> {status}</Badge>;
      case 'Collected':
        return <Badge bg="success" className="py-2 px-3 rounded-pill"><FaCheckCircle className="me-1" /> {status}</Badge>;
      case 'Processing':
        return <Badge bg="primary" className="py-2 px-3 rounded-pill"><FaClock className="me-1" /> {status}</Badge>;
      default:
        return <Badge bg="secondary" className="py-2 px-3 rounded-pill">{status}</Badge>;
    }
  };
  
  return (
    <Container className="py-5">
      <h2 className="text-center fw-bold mb-4">Food Ordering</h2>
      
      {/* Main Navigation Tabs */}
      <div className="d-flex justify-content-center mb-4">
        <Nav variant="pills" className="nav-fill shadow-sm rounded-pill bg-white p-1" style={{ width: '300px' }}>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'order'} 
              onClick={() => handleMainTabChange('order')}
              className="rounded-pill d-flex align-items-center justify-content-center gap-2"
            >
              <FaShoppingBag /> Order Now
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'history'} 
              onClick={() => handleMainTabChange('history')}
              className="rounded-pill d-flex align-items-center justify-content-center gap-2"
            >
              <FaHistory /> Past Orders
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
      
      {activeTab === 'order' ? (
        <>
          {/* Order Type Toggle */}
          <div className="d-flex justify-content-center mb-4">
            <ToggleButtonGroup type="radio" name="orderType" value={orderType} onChange={handleTabChange} className="shadow-sm">
              <ToggleButton id="delivery" value="delivery" variant={orderType === 'delivery' ? 'warning' : 'outline-warning'} className="d-flex align-items-center px-4 py-2">
                <FaTruck className="me-2" /> Delivery
              </ToggleButton>
              <ToggleButton id="pickup" value="pickup" variant={orderType === 'pickup' ? 'warning' : 'outline-warning'} className="d-flex align-items-center px-4 py-2">
                <FaStore className="me-2" /> Pickup
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <Row className="gy-4">
            {/* Menu Section */}
            <Col md={8}>
              <Card className="shadow-sm border-0 rounded-3 overflow-hidden">
                <Menu orderType={orderType} />
              </Card>
            </Col>

            {/* Cart Section */}
            <Col md={4}>
              <Card className="border-0 position-sticky" style={{ top: '24px' }}>
                <Cart 
                  items={cartItems} 
                  updateQuantity={updateQuantity} 
                  removeItem={removeItem} 
                  orderType={orderType} 
                />
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
          <Card.Header className="bg-white py-4 border-bottom">
            <h4 className="mb-0 d-flex align-items-center">
              <FaHistory className="me-3 text-warning" /> Order History
            </h4>
          </Card.Header>
          <Card.Body className="p-0">
            {orderHistory.length === 0 ? (
              <div className="text-center py-5">
                <FaHistory size={48} className="text-secondary opacity-50 mb-3" />
                <h5>No order history yet</h5>
                <p className="text-muted">Your previous orders will appear here</p>
                <Button 
                  variant="warning" 
                  className="mt-2 px-4 py-2" 
                  style={{ borderRadius: '30px' }}
                  onClick={() => setActiveTab('order')}
                >
                  Place Your First Order
                </Button>
              </div>
            ) : (
              <ListGroup variant="flush">
                {orderHistory.map((order) => (
                  <ListGroup.Item key={order.id} className="p-4 border-bottom">
                    <div className="d-md-flex justify-content-between align-items-start">
                      <div className="mb-3 mb-md-0">
                        <div className="d-flex align-items-center mb-2">
                          <h5 className="mb-0 me-3">{order.restaurant}</h5>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-muted mb-2">
                          {order.date} at {order.time} • 
                          <span className="ms-1">
                            {order.type === 'delivery' ? <FaTruck className="me-1" /> : <FaStore className="me-1" />}
                            {order.type === 'delivery' ? 'Delivery' : 'Pickup'}
                          </span>
                        </p>
                        <div className="order-items mt-3">
                          <p className="fw-medium mb-2">Items:</p>
                          <ul className="text-muted ps-3 mb-0">
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                {item.quantity}x {item.name} (£{item.price.toFixed(2)})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="text-md-end">
                        <div className="order-id text-muted small mb-2">{order.id}</div>
                        <div className="fw-bold mb-3">Total: £{order.total.toFixed(2)}</div>
                        <Button 
                          variant="outline-warning" 
                          className="px-4" 
                          style={{ borderRadius: '30px' }}
                          onClick={() => reorder(order)}
                        >
                          Reorder
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          className="px-4 ms-2" 
                          style={{ borderRadius: '30px'}}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default OrderPage;