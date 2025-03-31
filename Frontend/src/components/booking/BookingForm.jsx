import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';

const timeSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30'
];

const BookingForm = ({ 
  selectedDate, 
  selectedTime, 
  onTimeChange, 
  guestCount, 
  onGuestCountChange, 
  selectedTable, 
  onSuccessfulBooking, 
  restaurantList,
  onRestaurantChange
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
    restaurant: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If restaurant selection changes, fetch tables for that restaurant
    if (name === 'restaurant' && value) {
      onRestaurantChange(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !selectedTable || !formData.restaurant) {
      setError('Please select a date, time, table, and restaurant before booking');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        restaurantId: formData.restaurant,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        guests: guestCount,
        tableId: selectedTable,
        specialRequests: formData.specialRequests,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      };

      const response = await axios.post('http://localhost:5000/api/bookings', bookingData);

      if (response.data.success) {
        // Find the restaurant name for display
        const restaurant = restaurantList.find(r => r.id === formData.restaurant);
        const restaurantName = restaurant ? restaurant.name : 'TurkNazz';

        onSuccessfulBooking({
          restaurant: restaurantName,
          date: bookingData.date,
          time: bookingData.time,
          guests: bookingData.guests,
          email: formData.email
        });

        setError('');
        setFormData({
          name: '',
          email: '',
          phone: '',
          specialRequests: '',
          restaurant: '',
        });
      } else {
        setError('Unable to complete booking. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Select Restaurant</Form.Label>
        <Form.Select name="restaurant" value={formData.restaurant} onChange={handleChange} required>
          <option value="">Choose a restaurant</option>
          {restaurantList.map(restaurant => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.name} - {restaurant.address}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Preferred Time</Form.Label>
            <Form.Select value={selectedTime} onChange={(e) => onTimeChange(e.target.value)} required>
              <option value="">Select a time</option>
              {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Number of Guests</Form.Label>
            <Form.Select value={guestCount} onChange={(e) => onGuestCountChange(parseInt(e.target.value))} required>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Full Name</Form.Label>
        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Special Requests</Form.Label>
        <Form.Control as="textarea" rows={3} name="specialRequests" value={formData.specialRequests} onChange={handleChange} />
      </Form.Group>

      <Button type="submit" variant="primary" className="w-100" disabled={loading || !selectedTable}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Confirm Reservation'}
      </Button>
    </Form>
  );
};

export default BookingForm;