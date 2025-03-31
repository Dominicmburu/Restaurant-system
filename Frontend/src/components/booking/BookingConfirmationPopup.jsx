import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

const BookingConfirmationPopup = ({ show, onHide, bookingDetails }) => {
  const [showCancellationInfo, setShowCancellationInfo] = useState(false);

  const handleCancellationToggle = () => {
    setShowCancellationInfo(!showCancellationInfo);
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      backdrop="static" 
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Booking Confirmed!</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Alert variant="success">
          <p className="mb-2">
            <strong>Your reservation has been sent successfully!</strong>
          </p>
          <p className="mb-0">
            We will contact you at {bookingDetails.email} to confirm your booking.
          </p>
        </Alert>

        <div className="mt-3">
          <h6>Booking Details:</h6>
          <ul className="list-unstyled">
            <li><strong>Restaurant:</strong> {bookingDetails.restaurant}</li>
            <li><strong>Date:</strong> {bookingDetails.date}</li>
            <li><strong>Time:</strong> {bookingDetails.time}</li>
            <li><strong>Guests:</strong> {bookingDetails.guests}</li>
          </ul>
        </div>

        <Button 
          variant="link" 
          onClick={handleCancellationToggle}
          className="p-0 text-primary"
        >
          {showCancellationInfo ? 'Hide' : 'Need to cancel?'}
        </Button>

        {showCancellationInfo && (
          <Alert variant="warning" className="mt-3">
            <p>
              If you need to cancel or modify your booking, please contact us 
              at least 24 hours before your reservation time.
            </p>
            <p className="mb-0">
              <strong>Contact:</strong> cancellations@turknazz.com or call 0121 XXX XXXX
            </p>
          </Alert>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingConfirmationPopup;