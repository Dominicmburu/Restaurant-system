import React from 'react';
import { Form } from 'react-bootstrap';

const BookingCalendar = ({ selectedDate, onDateChange }) => {
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="d-flex justify-content-center">
      <Form.Group>
        <Form.Label>Select Date</Form.Label>
        <Form.Control
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          min={today}
          max={maxDateString}
          onChange={(e) => onDateChange(new Date(e.target.value))}
        />
      </Form.Group>
    </div>
  );
};

export default BookingCalendar;
