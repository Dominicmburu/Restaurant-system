import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash, Eye, MapPin, MoreVertical, Check, X, Clock, Phone, Mail, Users } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    city: 'all',
    status: 'all'
  });

  // Fetch restaurants on component mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Fetch all restaurants from API
  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/restaurants', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setRestaurants(response.data.data);
      } else {
        setError('Failed to load restaurants');
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      
      if (err.response && err.response.status === 401) {
        window.location.href = '/login';
        return;
      }
      
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique cities for filter dropdown
  const cities = ['all', ...new Set(restaurants.map(restaurant => restaurant.city))];

  // Filter restaurants based on search and filters
  const filteredRestaurants = restaurants.filter(restaurant => {
    // Search filter
    const matchesSearch = 
      restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(filters.search.toLowerCase()) ||
      restaurant.city.toLowerCase().includes(filters.search.toLowerCase()) ||
      restaurant.postcode.toLowerCase().includes(filters.search.toLowerCase());
    
    // City filter
    const matchesCity = filters.city === 'all' || restaurant.city === filters.city;
    
    return matchesSearch && matchesCity;
  });

  // Function to view restaurant details
  const handleViewDetails = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  // Function to close the details modal
  const handleCloseDetails = () => {
    setSelectedRestaurant(null);
  };

  // Function to format time (e.g., "11:00" to "11:00 AM")
  const formatTime = (time) => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    
    if (hour < 12) {
      return `${time} AM`;
    } else if (hour === 12) {
      return `${time} PM`;
    } else {
      return `${hour - 12}:${minutes} PM`;
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Restaurants Management">
        <div className="container-fluid p-4 text-center">
          <div className="spinner-border text-warning mt-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading restaurants...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Restaurants Management">
        <div className="container-fluid p-4">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button 
            onClick={fetchRestaurants} 
            className="btn btn-warning"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Restaurants Management">
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3">Restaurants</h1>
          <button className="btn btn-warning text-white">
            Add New Restaurant
          </button>
        </div>

        {/* Filters and Search */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-8">
                <div className="position-relative">
                  <input
                    type="text"
                    placeholder="Search restaurants by name, address, or postcode..."
                    className="form-control ps-5"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                  <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                    <Search size={20} />
                  </span>
                </div>
              </div>
              
              <div className="col-md-4">
                <select 
                  className="form-select"
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                >
                  <option value="all">All Cities</option>
                  {cities.filter(city => city !== 'all').map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant count summary */}
        <div className="alert alert-light mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Total Restaurants:</strong> {restaurants.length}
            </div>
            <div>
              <button 
                onClick={fetchRestaurants} 
                className="btn btn-sm btn-outline-secondary"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Restaurants Table */}
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Restaurant</th>
                    <th>Location</th>
                    <th>Contact</th>
                    <th>Hours</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map(restaurant => (
                      <tr key={restaurant.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                              style={{ width: '40px', height: '40px', fontSize: '18px' }}>
                              {restaurant.name.charAt(0)}
                            </div>
                            <div>
                              <div className="fw-medium">{restaurant.name}</div>
                              <small className="text-muted">
                                ID: {restaurant.id.slice(0, 8)}...
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <MapPin size={16} className="me-1 text-warning" />
                            <div>
                              <div>{restaurant.address}</div>
                              <small className="text-muted">{restaurant.city}, {restaurant.postcode}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <small className="d-flex align-items-center mb-1">
                              <Phone size={14} className="me-1 text-muted" /> {restaurant.phone}
                            </small>
                            <small className="d-flex align-items-center">
                              <Mail size={14} className="me-1 text-muted" /> {restaurant.email}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Clock size={16} className="me-1 text-warning" />
                            {formatTime(restaurant.openTime)} - {formatTime(restaurant.closeTime)}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Users size={16} className="me-1 text-warning" />
                            {restaurant.maxSeating} seats
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewDetails(restaurant)}
                            >
                              <Eye size={18} />
                            </button>
                            <button className="btn btn-sm btn-outline-secondary">
                              <Edit size={18} />
                            </button>
                            <div className="dropdown">
                              <button 
                                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                type="button"
                                id={`dropdown-${restaurant.id}`}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <MoreVertical size={18} />
                              </button>
                              <ul className="dropdown-menu" aria-labelledby={`dropdown-${restaurant.id}`}>
                                <li>
                                  <a className="dropdown-item" href={`/admin/restaurants/${restaurant.id}`}>
                                    View Details
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href={`/admin/restaurants/${restaurant.id}/menu`}>
                                    Manage Menu
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href={`/admin/restaurants/${restaurant.id}/tables`}>
                                    Manage Tables
                                  </a>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                  <button className="dropdown-item text-danger">
                                    Deactivate
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="text-muted">
                          <p>No restaurants found matching your search criteria.</p>
                          {filters.search || filters.city !== 'all' ? (
                            <button 
                              className="btn btn-sm btn-outline-secondary" 
                              onClick={() => setFilters({search: '', city: 'all', status: 'all'})}
                            >
                              Clear filters
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Detail Modal */}
      {selectedRestaurant && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedRestaurant.name}</h5>
                <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <h6 className="text-muted mb-2">Location Information</h6>
                      <p className="d-flex align-items-start mb-1">
                        <MapPin size={16} className="me-2 mt-1 text-warning" />
                        <span>
                          {selectedRestaurant.address}<br />
                          {selectedRestaurant.city}, {selectedRestaurant.postcode}
                        </span>
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h6 className="text-muted mb-2">Contact Information</h6>
                      <p className="d-flex align-items-center mb-1">
                        <Phone size={16} className="me-2 text-warning" />
                        {selectedRestaurant.phone}
                      </p>
                      <p className="d-flex align-items-center mb-1">
                        <Mail size={16} className="me-2 text-warning" />
                        {selectedRestaurant.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-4">
                      <h6 className="text-muted mb-2">Opening Hours</h6>
                      <p className="d-flex align-items-center mb-1">
                        <Clock size={16} className="me-2 text-warning" />
                        {formatTime(selectedRestaurant.openTime)} - {formatTime(selectedRestaurant.closeTime)}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h6 className="text-muted mb-2">Capacity</h6>
                      <p className="d-flex align-items-center mb-1">
                        <Users size={16} className="me-2 text-warning" />
                        {selectedRestaurant.maxSeating} maximum seating capacity
                      </p>
                    </div>
                  </div>
                </div>
                
                <hr />
                
                <div className="row mt-3">
                  <div className="col-12">
                    <h6 className="text-muted mb-3">Quick Actions</h6>
                    <div className="d-flex flex-wrap gap-2">
                      <a href={`/admin/restaurants/${selectedRestaurant.id}/menu`} className="btn btn-outline-primary">
                        Manage Menu
                      </a>
                      <a href={`/admin/restaurants/${selectedRestaurant.id}/tables`} className="btn btn-outline-primary">
                        Manage Tables
                      </a>
                      <a href={`/admin/restaurants/${selectedRestaurant.id}/staff`} className="btn btn-outline-primary">
                        Manage Staff
                      </a>
                      <a href={`/admin/restaurants/${selectedRestaurant.id}/edit`} className="btn btn-outline-secondary">
                        Edit Restaurant
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="alert alert-warning">
                      <h6 className="alert-heading">Restaurant Details</h6>
                      <p className="mb-0 small">
                        This restaurant was created on {new Date(selectedRestaurant.createdAt).toLocaleDateString()} 
                        and last updated on {new Date(selectedRestaurant.updatedAt).toLocaleDateString()}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDetails}>Close</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </AdminLayout>
  );
};

export default RestaurantsList;