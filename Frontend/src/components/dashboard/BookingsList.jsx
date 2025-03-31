import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, Info, ChevronLeft, ChevronRight, Filter, Edit, X, Check, Download, RefreshCw, AlertCircle, Utensils, MapPin } from 'lucide-react';
import { Modal, Button, Form, Table, Badge, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    restaurant: 'all',
    status: 'all'
  });

  // Unique restaurants extracted from bookings
  const [restaurants, setRestaurants] = useState([]);

  // For viewing booking details
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // For editing booking
  const [editMode, setEditMode] = useState(false);
  const [editedBooking, setEditedBooking] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Booking status options
  const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED'];

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Extract unique restaurants when bookings change
  useEffect(() => {
    if (bookings.length > 0) {
      const uniqueRestaurants = [...new Set(bookings.map(booking => booking.restaurant?.id))]
        .filter(id => id)
        .map(id => {
          const restaurant = bookings.find(booking => booking.restaurant?.id === id)?.restaurant;
          return restaurant;
        });
      setRestaurants(uniqueRestaurants);
    }
  }, [bookings]);

  // Fetch all bookings from API
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setBookings(response.data.data);
        setError(null);
      } else {
        setError('Failed to load bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      
      if (err.response && err.response.status === 401) {
        window.location.href = '/login';
        return;
      }
      
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const handleStatusUpdate = async (bookingId, newStatus) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Update the booking in state
        setBookings(bookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        ));
        
        // If the booking is selected, update its status too
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
        
        // Display success message
        alert(`Booking status updated to ${newStatus}`);
      } else {
        alert('Failed to update booking status');
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Error updating booking status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }
    
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Update the booking in state
        setBookings(bookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'CANCELLED' } : booking
        ));
        
        // If the booking is selected, update its status too
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: 'CANCELLED' });
        }
        
        // Display success message
        alert('Booking has been cancelled');
      } else {
        alert('Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Error cancelling booking. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Function to view booking details
  const handleViewBooking = (bookingId) => {
    const booking = bookings.find(booking => booking.id === bookingId);
    setSelectedBooking(booking);
    setShowDetails(true);
    setEditMode(false);
  };

  // Function to close booking details
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedBooking(null);
    setEditMode(false);
  };

  // Function to export bookings as CSV
  const handleExportBookings = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Booking Number,Customer,Restaurant,Date,Time,Guests,Table,Status,Special Requests\n";
    
    // Add data rows
    filteredBookings.forEach(booking => {
      const row = [
        booking.bookingNumber || "N/A",
        "Guest",
        booking.restaurant?.name || "N/A",
        formatDate(booking.date),
        booking.time,
        booking.guests,
        booking.table?.tableNumber || "N/A",
        booking.status,
        `"${(booking.specialRequests || "").replace(/"/g, '""')}"`
      ];
      
      csvContent += row.join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bookings_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    
    // Download the CSV file
    link.click();
    document.body.removeChild(link);
  };

  // Filter bookings based on filters
  const filteredBookings = bookings.filter(booking => {
    // Search filter
    const searchLower = filters.search.toLowerCase();
    const matchesSearch = (booking.bookingNumber?.toLowerCase().includes(searchLower) || 
                           booking.restaurant?.name?.toLowerCase().includes(searchLower));
    
    // Status filter
    const matchesStatus = filters.status === 'all' || booking.status === filters.status;
    
    // Restaurant filter
    const matchesRestaurant = filters.restaurant === 'all' || booking.restaurant?.id === filters.restaurant;
    
    // Date filter - check if the booking date contains the filter date
    const bookingDate = booking.date ? new Date(booking.date).toISOString().slice(0, 10) : '';
    const matchesDate = !filters.date || bookingDate === filters.date;
    
    return matchesSearch && matchesStatus && matchesRestaurant && matchesDate;
  });

  // Sort bookings by date (newest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    return dateB - dateA;
  });

  // Active bookings and past bookings
  const today = new Date();
  const activeBookings = sortedBookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate >= today && booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED';
  });
  
  const pastBookings = sortedBookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate < today || booking.status === 'CANCELLED' || booking.status === 'COMPLETED';
  });

  // Pagination logic
  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // Function to get status badge styling
  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'SEATED':
        return 'info';
      case 'COMPLETED':
        return 'primary';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      date: '',
      restaurant: 'all',
      status: 'all'
    });
  };

  if (loading && bookings.length === 0) {
    return (
      <AdminLayout title="Bookings Management">
        <div className="container-fluid p-4 text-center">
          <div className="spinner-border text-warning mt-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading bookings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Bookings Management">
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-0">Table Reservations</h1>
            <p className="text-muted">Manage and track all customer bookings</p>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={fetchBookings}
              disabled={loading}
            >
              <RefreshCw size={18} className={`me-1 ${loading ? 'spinner' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="warning" 
              onClick={handleExportBookings}
              className="d-flex align-items-center"
            >
              <Download size={18} className="me-1" />
              Export Bookings
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4">
            <AlertCircle size={18} className="me-2" />
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6 position-relative">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <Search size={18} />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search by booking number or restaurant..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="d-flex gap-2">
                  <Form.Control 
                    type="date" 
                    value={filters.date}
                    onChange={(e) => setFilters({...filters, date: e.target.value})}
                    aria-label="Filter by date"
                    className="flex-grow-1"
                  />
                  
                  <Form.Select 
                    value={filters.restaurant}
                    onChange={(e) => setFilters({...filters, restaurant: e.target.value})}
                    aria-label="Filter by restaurant"
                    className="flex-grow-1"
                  >
                    <option value="all">All Restaurants</option>
                    {restaurants.map(restaurant => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </Form.Select>
                  
                  <Form.Select 
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    aria-label="Filter by status"
                    className="flex-grow-1"
                  >
                    <option value="all">All Status</option>
                    {BOOKING_STATUSES.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </Form.Select>
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={resetFilters}
                    title="Reset filters"
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Bookings Section */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center bg-warning bg-opacity-10">
            <h5 className="mb-0">Upcoming Reservations</h5>
            <span className="badge bg-warning text-dark">
              {activeBookings.length} upcoming bookings
            </span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <Table hover>
                <thead className="table-light">
                  <tr>
                    <th>Booking #</th>
                    <th>Restaurant</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Table</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBookings.length > 0 ? (
                    activeBookings.slice(0, 5).map(booking => (
                      <tr key={booking.id}>
                        <td className="fw-medium">{booking.bookingNumber}</td>
                        <td>{booking.restaurant?.name || 'Unknown'}</td>
                        <td>{formatDate(booking.date)}</td>
                        <td>{booking.time}</td>
                        <td>{booking.guests}</td>
                        <td>{booking.table?.tableNumber || 'N/A'}</td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(booking.status)}>
                            {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewBooking(booking.id)}
                              title="View Booking Details"
                            >
                              <Info size={16} />
                            </Button>
                            
                            <Dropdown>
                              <Dropdown.Toggle 
                                variant="outline-warning" 
                                size="sm"
                                id={`status-dropdown-${booking.id}`}
                                title="Update Status"
                              >
                                <Clock size={16} />
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <Dropdown.Header>Update Status:</Dropdown.Header>
                                {BOOKING_STATUSES
                                  .filter(status => status !== booking.status)
                                  .map(status => (
                                    <Dropdown.Item
                                      key={status}
                                      onClick={() => handleStatusUpdate(booking.id, status)}
                                    >
                                      {status.charAt(0) + status.slice(1).toLowerCase()}
                                    </Dropdown.Item>
                                  ))
                                }
                              </Dropdown.Menu>
                            </Dropdown>
                            
                            {booking.status !== 'CANCELLED' && (
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                title="Cancel Booking"
                                disabled={actionLoading}
                              >
                                <X size={16} />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="text-muted">
                          <AlertCircle size={24} className="mb-2" />
                          <p>No upcoming bookings found</p>
                          {(filters.search || filters.date || filters.status !== 'all' || filters.restaurant !== 'all') && (
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={resetFilters}
                            >
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            
            {activeBookings.length > 5 && (
              <div className="text-center p-3">
                <Button variant="outline-primary" size="sm" onClick={() => setCurrentPage(1)}>
                  View All Bookings
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* All Bookings Section */}
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center bg-light">
            <h5 className="mb-0">All Reservations</h5>
            <span className="badge bg-secondary">
              {sortedBookings.length} total bookings
            </span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <Table hover>
                <thead className="table-light">
                  <tr>
                    <th>Booking #</th>
                    <th>Restaurant</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Table</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.length > 0 ? (
                    currentBookings.map(booking => (
                      <tr key={booking.id} className={booking.status === 'CANCELLED' ? 'table-danger bg-opacity-25' : ''}>
                        <td className="fw-medium">{booking.bookingNumber}</td>
                        <td>{booking.restaurant?.name || 'Unknown'}</td>
                        <td>{formatDate(booking.date)}</td>
                        <td>{booking.time}</td>
                        <td>{booking.guests}</td>
                        <td>{booking.table?.tableNumber || 'N/A'}</td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(booking.status)}>
                            {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewBooking(booking.id)}
                              title="View Booking Details"
                            >
                              <Info size={16} />
                            </Button>
                            
                            {!['CANCELLED', 'COMPLETED'].includes(booking.status) && (
                              <>
                                <Dropdown>
                                  <Dropdown.Toggle 
                                    variant="outline-warning" 
                                    size="sm"
                                    id={`status-dropdown-${booking.id}`}
                                    title="Update Status"
                                  >
                                    <Clock size={16} />
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    <Dropdown.Header>Update Status:</Dropdown.Header>
                                    {BOOKING_STATUSES
                                      .filter(status => status !== booking.status)
                                      .map(status => (
                                        <Dropdown.Item
                                          key={status}
                                          onClick={() => handleStatusUpdate(booking.id, status)}
                                        >
                                          {status.charAt(0) + status.slice(1).toLowerCase()}
                                        </Dropdown.Item>
                                      ))
                                    }
                                  </Dropdown.Menu>
                                </Dropdown>
                                
                                {booking.status !== 'CANCELLED' && (
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    title="Cancel Booking"
                                    disabled={actionLoading}
                                  >
                                    <X size={16} />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="text-muted">
                          <AlertCircle size={24} className="mb-2" />
                          <p>No bookings found</p>
                          {(filters.search || filters.date || filters.status !== 'all' || filters.restaurant !== 'all') && (
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={resetFilters}
                            >
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
          
          {/* Pagination */}
          {sortedBookings.length > itemsPerPage && (
            <div className="card-footer d-flex justify-content-between align-items-center">
              <div className="small text-muted">
                Showing {indexOfFirstBooking + 1} to {Math.min(indexOfLastBooking, sortedBookings.length)} of {sortedBookings.length} entries
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <Button 
                      variant="link" 
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                  </li>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <Button 
                        variant={currentPage === index + 1 ? 'primary' : 'link'} 
                        className="page-link"
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <Button 
                      variant="link" 
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
        
        {/* Booking Details Modal */}
        <Modal show={showDetails} onHide={handleCloseDetails} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Booking Details - {selectedBooking?.bookingNumber}
              {selectedBooking && (
                <Badge 
                  className="ms-2" 
                  bg={getStatusBadgeVariant(selectedBooking.status)}
                >
                  {selectedBooking.status.charAt(0) + selectedBooking.status.slice(1).toLowerCase()}
                </Badge>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedBooking ? (
              <div className="row g-3">
                <div className="col-md-6">
                  <h5 className="text-secondary mb-3">Booking Information</h5>
                  <div className="mb-2 d-flex align-items-start">
                    <Calendar size={18} className="me-2 text-primary mt-1" />
                    <div>
                      <div className="fw-medium">Date & Time</div>
                      <div>{formatDate(selectedBooking.date)} at {selectedBooking.time}</div>
                    </div>
                  </div>
                  <div className="mb-2 d-flex align-items-start">
                    <User size={18} className="me-2 text-primary mt-1" />
                    <div>
                      <div className="fw-medium">Guests</div>
                      <div>{selectedBooking.guests} people</div>
                    </div>
                  </div>
                  <div className="mb-2 d-flex align-items-start">
                    <Clock size={18} className="me-2 text-primary mt-1" />
                    <div>
                      <div className="fw-medium">Status</div>
                      <div>{selectedBooking.status.charAt(0) + selectedBooking.status.slice(1).toLowerCase()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <h5 className="text-secondary mb-3">Restaurant Information</h5>
                  <div className="mb-2 d-flex align-items-start">
                    <Utensils size={18} className="me-2 text-primary mt-1" />
                    <div>
                      <div className="fw-medium">Restaurant</div>
                      <div>{selectedBooking.restaurant?.name}</div>
                    </div>
                  </div>
                  <div className="mb-2 d-flex align-items-start">
                    <MapPin size={18} className="me-2 text-primary mt-1" />
                    <div>
                      <div className="fw-medium">Location</div>
                      <div>{selectedBooking.restaurant?.address}</div>
                      <div>{selectedBooking.restaurant?.city}, {selectedBooking.restaurant?.postcode}</div>
                    </div>
                  </div>
                  <div className="mb-2 d-flex align-items-start">
                    <Info size={18} className="me-2 text-primary mt-1" />
                    <div>
                      <div className="fw-medium">Table</div>
                      <div>
                        {selectedBooking.table ? 
                          `Table #${selectedBooking.table.tableNumber} (${selectedBooking.table.capacity} seats)` : 
                          'Not assigned'
                        }
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedBooking.specialRequests && (
                  <div className="col-12">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">Special Requests</h6>
                        <p className="card-text">{selectedBooking.specialRequests}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="col-12">
                  <div className="alert alert-light mb-0">
                    <strong>Booking created:</strong> {new Date(selectedBooking.createdAt).toLocaleString('en-GB')}
                    <br />
                    <strong>Last updated:</strong> {new Date(selectedBooking.updatedAt).toLocaleString('en-GB')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                <AlertCircle size={24} className="mb-2" />
                <p>Booking details not available</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {selectedBooking && !['CANCELLED', 'COMPLETED'].includes(selectedBooking.status) && (
              <div className="me-auto">
                <Dropdown>
                  <Dropdown.Toggle variant="warning" id="dropdown-status">
                    Update Status
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {BOOKING_STATUSES
                      .filter(status => status !== selectedBooking.status)
                      .map(status => (
                        <Dropdown.Item
                          key={status}
                          onClick={() => {
                            handleStatusUpdate(selectedBooking.id, status);
                          }}
                        >
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </Dropdown.Item>
                      ))
                    }
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}
            {selectedBooking && selectedBooking.status !== 'CANCELLED' && (
              <Button 
                variant="danger"
                onClick={() => {
                  handleCancelBooking(selectedBooking.id);
                  handleCloseDetails();
                }}
                disabled={actionLoading}
              >
                Cancel Booking
              </Button>
            )}
            <Button 
              variant="secondary" 
              onClick={handleCloseDetails}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default BookingsList;