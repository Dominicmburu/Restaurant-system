// import React, { useState } from 'react';
// import { Card, Button, Modal, Form, Row, Col } from 'react-bootstrap';
// import { FaPlus, FaFire } from 'react-icons/fa';
// import { useOrder } from '../../hooks/useOrder';

// const MenuItem = ({ item, orderType }) => {
//   const { addToCart } = useOrder();
//   const [show, setShow] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [specialInstructions, setSpecialInstructions] = useState('');
//   const [selectedOptions, setSelectedOptions] = useState({});

//   // Example customization options - in a real app, these would come from the API
//   const customizationOptions = {
//     size: [
//       { id: 'regular', name: 'Regular', price: 0 },
//       { id: 'large', name: 'Large', price: 2.5 }
//     ],
//     extras: [
//       { id: 'cheese', name: 'Extra Cheese', price: 1.5 },
//       { id: 'bacon', name: 'Bacon', price: 2 },
//       { id: 'mushrooms', name: 'Mushrooms', price: 1 }
//     ]
//   };

//   const handleShow = () => setShow(true);
//   const handleClose = () => {
//     setShow(false);
//     setQuantity(1);
//     setSpecialInstructions('');
//     setSelectedOptions({});
//   };

//   const handleAddToCart = () => {
//     const customizations = { ...selectedOptions, specialInstructions };

//     addToCart({
//       id: item.id,
//       name: item.name,
//       price: item.price,
//       quantity,
//       customizations,
//       orderType
//     });

//     handleClose();
//   };

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value, 10);
//     setQuantity(value > 0 ? value : 1);
//   };

//   const handleOptionChange = (category, value, isCheckbox = false) => {
//     if (isCheckbox) {
//       setSelectedOptions(prev => ({
//         ...prev,
//         [category]: {
//           ...prev[category],
//           [value]: !prev[category]?.[value]
//         }
//       }));
//     } else {
//       setSelectedOptions(prev => ({
//         ...prev,
//         [category]: value
//       }));
//     }
//   };

//   const calculateTotalPrice = () => {
//     let total = item.price;
    
//     // Add size price if selected
//     if (selectedOptions.size) {
//       const selectedSize = customizationOptions.size.find(s => s.id === selectedOptions.size);
//       if (selectedSize) {
//         total += selectedSize.price;
//       }
//     }

//     // Add extras prices
//     if (selectedOptions.extras) {
//       customizationOptions.extras.forEach(extra => {
//         if (selectedOptions.extras[extra.id]) {
//           total += extra.price;
//         }
//       });
//     }

//     return total * quantity;
//   };

//   return (
//     <>
//       <Card className="d-flex flex-row p-2 border border-light shadow-sm position-relative">
//         {item.popular && (
//           <div className="position-absolute top-0 end-0 p-2 text-danger">
//             <FaFire /> Popular
//           </div>
//         )}

//         <Card.Img 
//           variant="left" 
//           src={item.image} 
//           alt={item.name} 
//           className="rounded me-2" 
//           style={{ width: '100px', height: '100px' }}
//         />

//         <Card.Body className="d-flex flex-column">
//           <Card.Title>{item.name}</Card.Title>
//           <Card.Text className="text-muted small">{item.description}</Card.Text>

//           <div className="d-flex justify-content-between align-items-center mt-2">
//             <strong className="text-primary">${item.price.toFixed(2)}</strong>
            
//             <Button variant="primary" size="sm" onClick={handleShow}>
//               <FaPlus /> Add
//             </Button>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Modal for Customization */}
//       <Modal show={show} onHide={handleClose} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Customize {item.name}</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           {/* Size Selection */}
//           <Form.Group className="mb-3">
//             <Form.Label>Size</Form.Label>
//             {customizationOptions.size.map((size) => (
//               <Form.Check 
//                 key={size.id} 
//                 type="radio" 
//                 name="size" 
//                 label={`${size.name} ${size.price > 0 ? `(+${size.price.toFixed(2)})` : ''}`}
//                 checked={selectedOptions.size === size.id}
//                 onChange={() => handleOptionChange('size', size.id)}
//               />
//             ))}
//           </Form.Group>

//           {/* Extras Selection */}
//           <Form.Group className="mb-3">
//             <Form.Label>Extras</Form.Label>
//             {customizationOptions.extras.map((extra) => (
//               <Form.Check 
//                 key={extra.id} 
//                 type="checkbox" 
//                 label={`${extra.name} (+${extra.price.toFixed(2)})`}
//                 checked={selectedOptions.extras?.[extra.id] || false}
//                 onChange={() => handleOptionChange('extras', extra.id, true)}
//               />
//             ))}
//           </Form.Group>

//           {/* Special Instructions */}
//           <Form.Group className="mb-3">
//             <Form.Label>Special Instructions</Form.Label>
//             <Form.Control 
//               as="textarea" 
//               rows={2} 
//               placeholder="Any special requests? (e.g., allergies, spice level)"
//               value={specialInstructions}
//               onChange={(e) => setSpecialInstructions(e.target.value)}
//             />
//           </Form.Group>

//           {/* Quantity Selection */}
//           <Row className="mb-3">
//             <Col xs={6}>
//               <Form.Label>Quantity</Form.Label>
//               <Form.Control 
//                 type="number" 
//                 min="1" 
//                 value={quantity} 
//                 onChange={handleQuantityChange} 
//               />
//             </Col>
//             <Col xs={6} className="d-flex align-items-end justify-content-end">
//               <strong className="fs-5">Total: ${calculateTotalPrice().toFixed(2)}</strong>
//             </Col>
//           </Row>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>Cancel</Button>
//           <Button variant="primary" onClick={handleAddToCart}>
//             <FaPlus /> Add to Cart
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default MenuItem;
