import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';

const ItemAddedConfirmationPopup = ({ show, onHide, item, onAddToCart }) => {
  if (!item) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCheck className="me-2 text-success" /> Item Added to Cart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex mb-3 p-2 bg-light rounded">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="rounded me-3"
              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
            />
          )}
          <div>
            <h6 className="mb-1">{item.name}</h6>
            <p className="mb-0 text-muted small">{item.description.substring(0, 80)}...</p>
            <div className="fw-bold mt-1">£{parseFloat(item.price).toFixed(2)}</div>
          </div>
        </div>
        
        <p className="text-muted">
          Your item has been successfully added to the cart.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Continue Shopping
        </Button>
        <Button 
          variant="warning" 
          onClick={() => {
            onHide();
            onAddToCart();
          }}
        >
          <FaShoppingCart className="me-2" /> View Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemAddedConfirmationPopup;