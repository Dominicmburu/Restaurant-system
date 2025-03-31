import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Badge,
  Modal
} from 'react-bootstrap';
import {
  FaSearch,
  FaStar,
  FaShoppingCart,
  FaFilter,
  FaTimesCircle
} from 'react-icons/fa';

const MenuPage = () => {
  const navigate = useNavigate();

  // State Management
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [itemNotes, setItemNotes] = useState('');

  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false
  });

  // Modal States
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch Menu Data
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menu');
        if (response.data.success) {
          const menuItems = response.data.data;
          setMenuData(menuItems);

          // Extract unique categories
          const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
          setCategories(uniqueCategories);

          // Set first category as default
          setActiveCategory(uniqueCategories[0]);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    fetchMenuData();
  }, []);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return menuData
      .filter(item => item.category === activeCategory)
      .filter(item => {
        // Search Filter
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Price Range Filter
        const matchesPriceRange =
          item.price >= priceRange[0] && item.price <= priceRange[1];

        // Dietary Filters
        const matchesVegetarian =
          !dietaryFilters.vegetarian || item.isVegetarian;
        const matchesVegan =
          !dietaryFilters.vegan || item.isVegan;
        const matchesGlutenFree =
          !dietaryFilters.glutenFree || item.isGlutenFree;

        return matchesSearch &&
          matchesPriceRange &&
          matchesVegetarian &&
          matchesVegan &&
          matchesGlutenFree;
      })
      .reduce((unique, item) =>
        unique.some(u => u.name === item.name) ? unique : [...unique, item],
        []);
  }, [
    menuData,
    activeCategory,
    searchQuery,
    priceRange,
    dietaryFilters
  ]);

  // Add Item to Cart
  // const addToCart = (item) => {
  //   const existingItemIndex = cartItems.findIndex(
  //     cartItem => cartItem.id === item.id
  //   );

  //   if (existingItemIndex > -1) {
  //     const updatedCart = [...cartItems];
  //     updatedCart[existingItemIndex].quantity += 1;
  //     setCartItems(updatedCart);
  //   } else {
  //     setCartItems([...cartItems, { ...item, quantity: 1 }]);
  //   }

  //   // Close modal after adding
  //   setShowItemModal(false);
  // };

  const addToCart = (item, notes = '') => {
    const existingItemIndex = cartItems.findIndex(
      cartItem => cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1,
        notes: notes || updatedCart[existingItemIndex].notes
      };
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1, notes }]);
    }

    // Close modal after adding
    setShowItemModal(false);
  };

  // Show Item Details Modal
  const showItemDetails = (item) => {
    setSelectedItem(item);
    setItemNotes('');
    setShowItemModal(true);
  };

  // View Cart
  const viewCart = () => {
    navigate('/checkout', {
      state: {
        items: cartItems,
        orderSummary: {
          subtotal: cartItems.reduce((acc, item) =>
            acc + (item.price * item.quantity), 0),
          deliveryFee: 2.99,
          tip: 0,
          total: cartItems.reduce((acc, item) =>
            acc + (item.price * item.quantity), 0) + 2.99,
          orderType: 'delivery'
        }
      }
    });
  };

  // Remove Item from Cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems
      .map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
      .filter(item => item.quantity > 0);

    setCartItems(updatedCart);
  };

  return (
    <Container fluid className="py-4 px-md-4" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Search and Filters Section */}
      <Row className="mb-4 align-items-center">
        <Col xs={12} md={6}>
          <h2 className="fw-bold" style={{ color: '#333' }}>
            TurkNazz TakeAway Menu
          </h2>
        </Col>
        <Col xs={12} md={6}>
          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="me-2"
              style={{ borderRadius: '30px' }}
            />
            <Button
              variant="warning"
              className="me-2"
              style={{ borderRadius: '30px', width: '50px', height: '50px' }}
            >
              <FaSearch />
            </Button>
            <Button
              variant="outline-warning"
              onClick={() => setShowFilters(!showFilters)}
              style={{ borderRadius: '30px', width: '50px', height: '50px' }}
            >
              <FaFilter />
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filters Card */}
      {showFilters && (
        <Card className="mb-4 shadow-sm" style={{ borderRadius: '15px' }}>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>Price Range</h5>
                <div className="d-flex align-items-center mb-3">
                  <span>£{priceRange[0]}</span>
                  <Form.Range
                    className="mx-3"
                    min={0}
                    max={30}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    style={{ flex: 1 }}
                  />
                  <span>£{priceRange[1]}</span>
                </div>
              </Col>
              <Col md={6}>
                <h5>Dietary Preferences</h5>
                {Object.entries(dietaryFilters).map(([key, value]) => (
                  <Form.Check
                    key={key}
                    type="checkbox"
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    checked={value}
                    onChange={() => setDietaryFilters(prev => ({
                      ...prev,
                      [key]: !prev[key]
                    }))}
                    className="mb-2"
                  />
                ))}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <Card
          className="mb-4 shadow-sm"
          style={{
            borderRadius: '15px',
            backgroundColor: '#FFF9C4'
          }}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5><FaShoppingCart className="me-2" />Your Order</h5>
                <p className="mb-0">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items ·
                  £{cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                </p>
              </div>
              <Button
                variant="warning"
                style={{ borderRadius: '30px' }}
                onClick={viewCart}
              >
                View Order
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Categories */}
      <div
        className="menu-categories mb-4 overflow-auto"
        style={{ whiteSpace: 'nowrap' }}
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === activeCategory ? "warning" : "outline-warning"}
            onClick={() => setActiveCategory(category)}
            className="me-2 mb-2"
            style={{ borderRadius: '30px', padding: '10px 20px' }}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Menu Items */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredMenuItems.map((item) => (
          <Col key={item.id}>
            <Card
              className="h-100 shadow-sm hover-shadow"
              style={{
                borderRadius: '15px',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onClick={() => showItemDetails(item)}
            >
              <Card.Img
                variant="top"
                src={item.image}
                style={{
                  borderTopLeftRadius: '15px',
                  borderTopRightRadius: '15px',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              {item.isPopular && (
                <Badge
                  bg="warning"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: '#000',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    padding: '5px 10px',
                  }}
                >
                  <FaStar className="me-1" /> Popular
                </Badge>
              )}
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title>{item.name}</Card.Title>
                  <div className="fw-bold">£{parseFloat(item.price).toFixed(2)}</div>
                </div>
                <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
                  {item.description}
                </Card.Text>
                <div className="mb-2">
                  {item.isVegetarian && (
                    <Badge bg="success" className="me-1" style={{ borderRadius: '20px' }}>
                      Vegetarian
                    </Badge>
                  )}
                  {item.isVegan && (
                    <Badge bg="success" className="me-1" style={{ borderRadius: '20px' }}>
                      Vegan
                    </Badge>
                  )}
                  {item.isGlutenFree && (
                    <Badge bg="info" className="me-1" style={{ borderRadius: '20px' }}>
                      Gluten Free
                    </Badge>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Item Details Modal */}
      <Modal
        show={showItemModal}
        onHide={() => setShowItemModal(false)}
        centered
      >
        {selectedItem && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedItem.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="img-fluid mb-3"
                style={{ borderRadius: '15px' }}
              /> */}
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="img-fluid mb-3"
                style={{
                  borderRadius: '15px',
                  maxHeight: '200px', 
                  width: '100%',      
                  objectFit: 'cover', 
                  display: 'block',   
                  margin: '0 auto'    
                }}
              />
              <p>{selectedItem.description}</p>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Price:</strong> £{parseFloat(selectedItem.price).toFixed(2)}
                </div>
                <div>
                  {selectedItem.isVegetarian && (
                    <Badge bg="success" className="me-1">Vegetarian</Badge>
                  )}
                  {selectedItem.isVegan && (
                    <Badge bg="success" className="me-1">Vegan</Badge>
                  )}
                  {selectedItem.isGlutenFree && (
                    <Badge bg="info" className="me-1">Gluten Free</Badge>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Form.Group className="m-3">
              <Form.Label>Special Instructions (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Any special requests?"
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
              />
            </Form.Group>
            <Modal.Footer>
              <Button
                variant="warning"
                onClick={() => addToCart(selectedItem, itemNotes)}
              >
                <FaShoppingCart className="me-2" /> Add to Order
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default MenuPage;