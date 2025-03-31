import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import BookingForm from './BookingForm';
import TableLayout from './TableLayout';
import BookingCalendar from './BookingCalendar';
import BookingConfirmationPopup from './BookingConfirmationPopup';
import axios from 'axios';

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  
  const [restaurants, setRestaurants] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/restaurants')
      .then(response => {
        if (response.data.success) {
          setRestaurants(response.data.data);
        } else {
          setError('Failed to fetch restaurants.');
        }
      })
      .catch(error => {
        setError('Error fetching restaurants');
      });
  }, []);

  // Function to fetch tables for a specific restaurant
  const fetchTables = (restaurantId) => {
    if (restaurantId) {
      axios.get(`http://localhost:5000/api/table/${restaurantId}`)
        .then(response => {
          if (response.data.success) {
            if (response.data.data.length > 0) {
              setTables(response.data.data);
              setError('');
            } else {
              setError('No tables available for the selected restaurant.');
              setTables([]);
            }
          } else {
            setError('No tables available for the selected restaurant.');
            setTables([]);
          }
        })
        .catch(error => {
          setError('Error fetching tables');
          setTables([]);
        });
    }
  };

  // Function to handle successful booking
  const handleSuccessfulBooking = (details) => {
    setBookingDetails(details);
    setShowConfirmationPopup(true);
    // Reset form values
    setSelectedTable(null);
    setSelectedTime('');
  };

  return (
    <Container className="py-5">
      <h2 className="text-center fw-bold mb-4 text-warning">Book a Table at TurkNazz</h2>
      <p className="text-center text-muted">Reserve a table at one of our three convenient TurkNazz locations and enjoy an authentic Turkish dining experience.</p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="gy-4">
        <Col md={7}>
          <Card className="shadow-sm p-3 border-warning">
            <h5 className="fw-bold mb-3 text-dark">Choose Your Date</h5>
            <BookingCalendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            
            <div className="mt-4">
              <h5 className="fw-bold text-dark">Available Tables</h5>
              {tables.length > 0 ? (
                <TableLayout
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  guestCount={guestCount}
                  selectedTable={selectedTable}
                  tables={tables}
                  onTableSelect={setSelectedTable}
                />
              ) : (
                <Alert variant="info">
                  Please select a restaurant and time to view available tables.
                </Alert>
              )}
            </div>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm p-3 border-warning">
            <h5 className="fw-bold mb-3 text-dark">Complete Your Reservation</h5>
            <BookingForm
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onTimeChange={setSelectedTime}
              guestCount={guestCount}
              onGuestCountChange={setGuestCount}
              selectedTable={selectedTable}
              onSuccessfulBooking={handleSuccessfulBooking}
              restaurantList={restaurants}
              onRestaurantChange={fetchTables}
            />
          </Card>
        </Col>
      </Row>

      <BookingConfirmationPopup
        show={showConfirmationPopup}
        onHide={() => setShowConfirmationPopup(false)}
        bookingDetails={bookingDetails}
      />
    </Container>
  );
};

export default BookingPage;