import React, { createContext, useState, useContext } from 'react';

// Create your tables (you can integrate the above table creation logic here)
const shirley = { id: 'shirley_id', name: 'TurkNazz Shirley' };
const moseley = { id: 'moseley_id', name: 'TurkNazz Moseley' };
const sutton = { id: 'sutton_id', name: 'TurkNazz Sutton Coldfield' };

const tableData = [];

// Shirley tables
for (let i = 1; i <= 12; i++) {
  tableData.push({
    tableNumber: i,
    capacity: i <= 6 ? 4 : (i <= 10 ? 6 : 8),
    restaurantId: shirley.id
  });
}

// Moseley tables
for (let i = 1; i <= 10; i++) {
  tableData.push({
    tableNumber: i,
    capacity: i <= 5 ? 4 : (i <= 8 ? 6 : 8),
    restaurantId: moseley.id
  });
}

// Sutton tables
for (let i = 1; i <= 11; i++) {
  tableData.push({
    tableNumber: i,
    capacity: i <= 6 ? 4 : (i <= 9 ? 6 : 8),
    restaurantId: sutton.id
  });
}

export const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState(tableData); // Store all tables here

  // Fetch available tables by restaurant ID
  const getTablesByRestaurant = (restaurantId) => {
    return tables.filter(table => table.restaurantId === restaurantId);
  };

  const fetchBookings = async () => {
    // Simulate an API call and return mock booking data
    return [
      { id: 1, tableId: 3, guests: 4, date: '2025-03-15', time: '19:00' }
    ];
  };

  // Create booking function
  const createBooking = (bookingData) => {
    const newBooking = { ...bookingData, id: bookings.length + 1 };
    setBookings([...bookings, newBooking]);
    return newBooking;
  };

  return (
    <BookingContext.Provider value={{ bookings, fetchBookings, createBooking, getTablesByRestaurant }}>
      {children}
    </BookingContext.Provider>
  );
};
