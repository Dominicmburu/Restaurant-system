import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Badge, Form } from 'react-bootstrap';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus, FaArrowRight, FaRegCreditCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Cart = ({ items = [], updateQuantity, removeItem, location, orderType = 'delivery' }) => {
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(orderType === 'delivery' ? 2.99 : 0);
  const [tip, setTip] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    setDeliveryFee(orderType === 'delivery' ? 2.99 : 0);
  }, [orderType]);
  
  useEffect(() => {
    const newSubtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    setSubtotal(newSubtotal);
    
    if (tipPercentage > 0) {
      setTip((newSubtotal * tipPercentage / 100).toFixed(2));
    }
  }, [items, tipPercentage]);
  
  const handleTipChange = (percentage) => {
    setTipPercentage(percentage);
    setTip(((subtotal * percentage) / 100).toFixed(2));
  };
  
  const handleCustomTip = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setTip(value.toFixed(2));
    if (subtotal > 0) {
      setTipPercentage((value / subtotal * 100).toFixed(0));
    }
  };
  
  const total = parseFloat(subtotal) + parseFloat(deliveryFee) + parseFloat(tip);
  
  const proceedToCheckout = () => {
    navigate('/checkout', { 
      state: { 
        items, 
        orderSummary: {
          subtotal,
          deliveryFee,
          tip,
          total,
          orderType,
          location
        }
      }
    });
  };
  
  if (items.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <div className="empty-cart-icon mb-4">
            <FaShoppingCart size={50} className="text-secondary opacity-50" />
          </div>
          <h4 className="mb-3">Your order is empty</h4>
          <p className="text-muted mb-4">Add some delicious Turkish dishes from our menu to get started</p>
          <Button 
            variant="outline-warning" 
            className="px-4 py-2" 
            style={{ borderRadius: '30px' }}
            onClick={() => navigate(-1)}
          >
            Browse Menu
          </Button>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-0 pt-4 pb-3">
        <h3 className="d-flex align-items-center">
          <FaShoppingCart className="me-3 text-warning" />
          Your Order
          <Badge bg="warning" className="ms-2 text-dark">
            {items.reduce((total, item) => total + item.quantity, 0)} items
          </Badge>
        </h3>
        {location && (
          <p className="text-muted mb-0">From {location.name}</p>
        )}
      </Card.Header>
      
      <Card.Body className="px-0 py-0">
        <ListGroup variant="flush">
          {items.map((item) => (
            <ListGroup.Item key={item.id} className="px-4 py-3 border-bottom d-flex align-items-center">
              <div className="item-image me-3">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="rounded" 
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                  />
                )}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="mb-0">{item.name}</h5>
                  <div className="ms-auto text-end">
                    <div className="fw-bold text-dark">£{(item.price * item.quantity).toFixed(2)}</div>
                    <div className="text-muted small">£{item.price.toFixed(2)} each</div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div>
                    {item.dietary && Object.values(item.dietary).some(value => value) && (
                      <div>
                        {item.dietary.vegetarian && (
                          <Badge bg="success" className="me-1" pill>Vegetarian</Badge>
                        )}
                        {item.dietary.vegan && (
                          <Badge bg="success" className="me-1" pill>Vegan</Badge>
                        )}
                        {item.dietary.glutenFree && (
                          <Badge bg="info" className="me-1" pill>Gluten Free</Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <Button 
                      variant={item.quantity <= 1 ? "outline-secondary" : "outline-warning"}
                      size="sm" 
                      className="d-flex justify-content-center align-items-center"
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus size={12} />
                    </Button>
                    <span className="mx-3 fw-medium">{item.quantity}</span>
                    <Button 
                      variant="outline-warning" 
                      size="sm"
                      className="d-flex justify-content-center align-items-center me-2"
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <FaPlus size={12} />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      className="d-flex justify-content-center align-items-center"
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                      onClick={() => removeItem(item.id)}
                    >
                      <FaTrash size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        
        <div className="px-4 pt-4">
          <div className="mb-4">
            <h5 className="mb-3">Add a Tip</h5>
            <div className="d-flex gap-2 mb-3">
              {[0, 10, 15, 20].map((percent) => (
                <Button 
                  key={percent} 
                  variant={tipPercentage == percent ? "warning" : "outline-warning"}
                  className="flex-grow-1 py-2"
                  onClick={() => handleTipChange(percent)}
                  style={{ borderRadius: '12px', fontWeight: tipPercentage == percent ? 'bold' : 'normal' }}
                >
                  {percent === 0 ? 'No tip' : `${percent}%`}
                </Button>
              ))}
            </div>
            <div className="d-flex align-items-center">
              <Form.Control
                type="number"
                placeholder="Custom amount"
                value={tip > 0 ? tip : ''}
                onChange={handleCustomTip}
                min="0"
                step="0.01"
                className="me-2"
                style={{ borderRadius: '12px' }}
              />
              <span className="fw-bold">£</span>
            </div>
          </div>
          
          <div className="order-summary bg-light p-3 rounded-3">
            <h5 className="mb-3">Order Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span className="fw-medium">£{subtotal.toFixed(2)}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee</span>
                <span className="fw-medium">£{deliveryFee.toFixed(2)}</span>
              </div>
            )}
            {parseFloat(tip) > 0 && (
              <div className="d-flex justify-content-between mb-2">
                <span>Tip</span>
                <span className="fw-medium">£{parseFloat(tip).toFixed(2)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between fw-bold mt-3 pt-3 border-top">
              <span>Total</span>
              <span>£{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card.Body>
      
      <Card.Footer className="bg-white border-0 p-4">
        <Button 
          variant="warning" 
          className="w-100 py-3 d-flex justify-content-center align-items-center"
          style={{ borderRadius: '15px', fontWeight: 'bold' }}
          onClick={proceedToCheckout}
        >
          <FaRegCreditCard className="me-2" />
          Proceed to Checkout <FaArrowRight className="ms-2" />
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default Cart;