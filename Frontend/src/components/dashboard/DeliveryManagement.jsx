import React, { useState, useEffect } from 'react';
import { Search, User, MapPin, Clock, TrendingUp, Filter, ChevronLeft, ChevronRight, Navigation, AlertCircle, PhoneCall, MessageCircle, CheckCircle, Truck, TruckIcon, ArrowUpCircle, Check, X, Calendar, ExternalLink, Map, Mail } from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import { Eye } from 'lucide-react';

const DeliveryManagement = () => {
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: 'David Williams',
      phone: '+44 7700 900789',
      email: 'david.williams@example.com',
      status: 'available',
      vehicle: 'Car',
      licensePlate: 'AB12 CDE',
      rating: 4.8,
      deliveryCount: 127,
      area: 'North London',
      currentLocation: { lat: 51.5614, lng: -0.1180 },
      lastActive: '2024-03-14T14:30:00'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      phone: '+44 7700 901234',
      email: 'maria.garcia@example.com',
      status: 'busy',
      vehicle: 'Motorcycle',
      licensePlate: 'FG34 HIJ',
      rating: 4.9,
      deliveryCount: 215,
      area: 'Central London',
      currentLocation: { lat: 51.5074, lng: -0.1278 },
      lastActive: '2024-03-14T14:45:00'
    },
    {
      id: 3,
      name: 'James Wilson',
      phone: '+44 7700 905678',
      email: 'james.wilson@example.com',
      status: 'available',
      vehicle: 'Car',
      licensePlate: 'KL56 MNO',
      rating: 4.7,
      deliveryCount: 98,
      area: 'East London',
      currentLocation: { lat: 51.5395, lng: 0.0026 },
      lastActive: '2024-03-14T14:15:00'
    },
    {
      id: 4,
      name: 'Sarah Martinez',
      phone: '+44 7700 909012',
      email: 'sarah.martinez@example.com',
      status: 'offline',
      vehicle: 'Bicycle',
      licensePlate: '',
      rating: 4.6,
      deliveryCount: 84,
      area: 'South London',
      currentLocation: { lat: 51.4613, lng: -0.1156 },
      lastActive: '2024-03-13T18:20:00'
    }
  ]);

  const [deliveries, setDeliveries] = useState([
    {
      id: 'DEL-2024-001',
      orderId: 'ORD-2024-003',
      restaurant: 'Sushiteria',
      restaurantAddress: '24 Charlotte St, London W1T 2NT',
      restaurantLocation: { lat: 51.5203, lng: -0.1363 },
      customer: 'Robert Johnson',
      address: '32 Oxford St, London W1D 1BW',
      customerLocation: { lat: 51.5159, lng: -0.1336 },
      items: [
        { name: 'Sushi Platter', quantity: 1 },
        { name: 'Miso Soup', quantity: 2 },
        { name: 'Green Tea', quantity: 2 }
      ],
      status: 'in_transit',
      driver: 2,
      pickupTime: '2024-03-14T17:05:00',
      estimatedDeliveryTime: '2024-03-14T17:25:00',
      actualDeliveryTime: null,
      distance: 1.2,
      specialInstructions: 'Call customer upon arrival',
      contactNumber: '+44 7700 123456'
    },
    {
      id: 'DEL-2024-002',
      orderId: 'ORD-2024-002',
      restaurant: 'Burger House',
      restaurantAddress: '76 Camden High St, London NW1 0LT',
      restaurantLocation: { lat: 51.5383, lng: -0.1425 },
      customer: 'Jane Smith',
      address: '22 Baker St, London NW1 5RT',
      customerLocation: { lat: 51.5237, lng: -0.1585 },
      items: [
        { name: 'Classic Bacon Hamburger', quantity: 1 },
        { name: 'Garlic Bread', quantity: 1 },
        { name: 'House Wine', quantity: 2 }
      ],
      status: 'ready',
      driver: null,
      pickupTime: null,
      estimatedDeliveryTime: null,
      actualDeliveryTime: null,
      distance: 1.8,
      specialInstructions: 'Leave at the door',
      contactNumber: '+44 7700 234567'
    },
    {
      id: 'DEL-2024-003',
      orderId: 'ORD-2024-001',
      restaurant: 'Burger House',
      restaurantAddress: '76 Camden High St, London NW1 0LT',
      restaurantLocation: { lat: 51.5383, lng: -0.1425 },
      customer: 'John Doe',
      address: '45 Oxford St, London W1D 2DZ',
      customerLocation: { lat: 51.5158, lng: -0.1423 },
      items: [
        { name: 'Margherita Pizza', quantity: 1 },
        { name: 'Chocolate Lava Cake', quantity: 2 },
        { name: 'Soft Drinks', quantity: 4 }
      ],
      status: 'delivered',
      driver: 1,
      pickupTime: '2024-03-14T19:30:00',
      estimatedDeliveryTime: '2024-03-14T19:55:00',
      actualDeliveryTime: '2024-03-14T19:52:00',
      distance: 2.3,
      specialInstructions: '',
      contactNumber: '+44 7700 345678'
    },
    {
      id: 'DEL-2024-004',
      orderId: 'ORD-2024-005',
      restaurant: 'Pasta Paradise',
      restaurantAddress: '32 Soho Square, London W1D 3AP',
      restaurantLocation: { lat: 51.5152, lng: -0.1320 },
      customer: 'Michael Brown',
      address: '78 Camden High St, London NW1 0LT',
      customerLocation: { lat: 51.5382, lng: -0.1426 },
      items: [
        { name: 'Spaghetti Carbonara', quantity: 1 },
        { name: 'Garlic Bread', quantity: 1 },
        { name: 'Tiramisu', quantity: 1 }
      ],
      status: 'cancelled',
      driver: null,
      pickupTime: null,
      estimatedDeliveryTime: null,
      actualDeliveryTime: null,
      distance: 2.7,
      specialInstructions: '',
      contactNumber: '+44 7700 456789'
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    driverStatus: 'all',
    deliveryStatus: 'all',
    date: ''
  });

  const [currentDriverPage, setCurrentDriverPage] = useState(1);
  const [currentDeliveryPage, setCurrentDeliveryPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverDetails, setShowDriverDetails] = useState(false);

  const [showReassignForm, setShowReassignForm] = useState(false);
  const [selectedDriverForAssignment, setSelectedDriverForAssignment] = useState(null);

  const handleViewDelivery = (deliveryId) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    setSelectedDelivery(delivery);
    setShowDeliveryDetails(true);
  };

  const handleCloseDeliveryDetails = () => {
    setShowDeliveryDetails(false);
    setSelectedDelivery(null);
  };

  const handleViewDriver = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    setSelectedDriver(driver);
    setShowDriverDetails(true);
  };

  const handleCloseDriverDetails = () => {
    setShowDriverDetails(false);
    setSelectedDriver(null);
  };

  const handleAssignDriver = (deliveryId, driverId) => {
    setDeliveries(deliveries.map(delivery => 
      delivery.id === deliveryId 
        ? {
            ...delivery, 
            driver: driverId,
            status: 'in_transit',
            pickupTime: new Date().toISOString(),
            estimatedDeliveryTime: new Date(Date.now() + 20 * 60000).toISOString() // 20 minutes from now
          } 
        : delivery
    ));

    setDrivers(drivers.map(driver => 
      driver.id === driverId 
        ? {...driver, status: 'busy'} 
        : driver
    ));

    if (showReassignForm) {
      setShowReassignForm(false);
      setSelectedDriverForAssignment(null);
    }

    if (selectedDelivery && selectedDelivery.id === deliveryId) {
      const updatedDelivery = {
        ...selectedDelivery,
        driver: driverId,
        status: 'in_transit',
        pickupTime: new Date().toISOString(),
        estimatedDeliveryTime: new Date(Date.now() + 20 * 60000).toISOString()
      };
      setSelectedDelivery(updatedDelivery);
    }
  };

  const handleMarkDelivered = (deliveryId) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    
    setDeliveries(deliveries.map(d => 
      d.id === deliveryId 
        ? {
            ...d, 
            status: 'delivered',
            actualDeliveryTime: new Date().toISOString()
          } 
        : d
    ));

    if (delivery.driver) {
      setDrivers(drivers.map(driver => 
        driver.id === delivery.driver 
          ? {...driver, status: 'available'} 
          : driver
      ));
    }

    if (selectedDelivery && selectedDelivery.id === deliveryId) {
      const updatedDelivery = {
        ...selectedDelivery,
        status: 'delivered',
        actualDeliveryTime: new Date().toISOString()
      };
      setSelectedDelivery(updatedDelivery);
    }
  };

  const handleCancelDelivery = (deliveryId) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    
    setDeliveries(deliveries.map(d => 
      d.id === deliveryId 
        ? {...d, status: 'cancelled', driver: null} 
        : d
    ));

    if (delivery.driver) {
      setDrivers(drivers.map(driver => 
        driver.id === delivery.driver 
          ? {...driver, status: 'available'} 
          : driver
      ));
    }

    if (selectedDelivery && selectedDelivery.id === deliveryId) {
      const updatedDelivery = {
        ...selectedDelivery,
        status: 'cancelled',
        driver: null
      };
      setSelectedDelivery(updatedDelivery);
    }
  };

  const handleDriverStatusUpdate = (driverId, newStatus) => {
    setDrivers(drivers.map(driver => 
      driver.id === driverId ? {...driver, status: newStatus} : driver
    ));

    if (selectedDriver && selectedDriver.id === driverId) {
      setSelectedDriver({...selectedDriver, status: newStatus});
    }
  };

  const handleOpenReassignForm = (deliveryId) => {
    setSelectedDelivery(deliveries.find(d => d.id === deliveryId));
    setShowReassignForm(true);
  };

  const filteredDrivers = drivers.filter(driver => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch = driver.name.toLowerCase().includes(searchLower) || 
                           driver.email.toLowerCase().includes(searchLower) ||
                           driver.phone.toLowerCase().includes(searchLower);
    
    const matchesStatus = filters.driverStatus === 'all' || driver.status === filters.driverStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredDeliveries = deliveries.filter(delivery => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch = delivery.id.toLowerCase().includes(searchLower) || 
                            delivery.orderId.toLowerCase().includes(searchLower) ||
                            delivery.customer.toLowerCase().includes(searchLower) ||
                            delivery.restaurant.toLowerCase().includes(searchLower) ||
                            delivery.address.toLowerCase().includes(searchLower);
    
    const matchesStatus = filters.deliveryStatus === 'all' || delivery.status === filters.deliveryStatus;
    
    const deliveryDate = delivery.pickupTime ? new Date(delivery.pickupTime).toISOString().split('T')[0] : null;
    const matchesDate = !filters.date || (deliveryDate && deliveryDate === filters.date);
    
    return matchesSearch && matchesStatus && (!filters.date || matchesDate);
  });

  const indexOfLastDriver = currentDriverPage * itemsPerPage;
  const indexOfFirstDriver = indexOfLastDriver - itemsPerPage;
  const currentDrivers = filteredDrivers.slice(indexOfFirstDriver, indexOfLastDriver);
  const totalDriverPages = Math.ceil(filteredDrivers.length / itemsPerPage);

  const indexOfLastDelivery = currentDeliveryPage * itemsPerPage;
  const indexOfFirstDelivery = indexOfLastDelivery - itemsPerPage;
  const currentDeliveries = filteredDeliveries.slice(indexOfFirstDelivery, indexOfLastDelivery);
  const totalDeliveryPages = Math.ceil(filteredDeliveries.length / itemsPerPage);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-GB', options);
  };

  // Function to get delivery status badge styling
  const getDeliveryStatusBadgeClass = (status) => {
    switch(status) {
      case 'ready':
        return 'bg-primary';
      case 'in_transit':
        return 'bg-warning';
      case 'delivered':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  // Function to get driver status badge styling
  const getDriverStatusBadgeClass = (status) => {
    switch(status) {
      case 'available':
        return 'bg-success';
      case 'busy':
        return 'bg-warning';
      case 'offline':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };

  // Function to format status text
  const formatStatusText = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Calculate ETA
  const calculateETA = (delivery) => {
    if (delivery.status === 'delivered') {
      return 'Delivered';
    }
    if (delivery.status === 'cancelled') {
      return 'Cancelled';
    }
    if (!delivery.estimatedDeliveryTime) {
      return 'Not assigned';
    }
    
    const now = new Date();
    const eta = new Date(delivery.estimatedDeliveryTime);
    const diffMinutes = Math.round((eta - now) / (1000 * 60));
    
    if (diffMinutes < 0) {
      return 'Delayed';
    }
    
    return `${diffMinutes} min`;
  };

  // Delivery Details Modal Component
  const DeliveryDetailsModal = () => {
    if (!selectedDelivery) return null;
    
    const assignedDriver = drivers.find(driver => driver.id === selectedDelivery.driver);
    
    return (
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delivery Details</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleCloseDeliveryDetails}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <div className={`rounded-circle me-2 ${
                    selectedDelivery.status === 'ready' ? 'bg-primary' : 
                    selectedDelivery.status === 'in_transit' ? 'bg-warning' : 
                    selectedDelivery.status === 'delivered' ? 'bg-success' : 
                    'bg-danger'
                  }`} style={{width: '8px', height: '8px'}}></div>
                  <span className={`badge ${getDeliveryStatusBadgeClass(selectedDelivery.status)} me-2`}>
                    {formatStatusText(selectedDelivery.status)}
                  </span>
                  <span className="text-muted small me-2">Delivery ID: {selectedDelivery.id}</span>
                  <span className="text-muted small">Order: {selectedDelivery.orderId}</span>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="card bg-light mb-3">
                      <div className="card-body">
                        <h6 className="d-flex align-items-center text-primary mb-2">
                          <MapPin size={18} className="me-2" /> Pickup Details
                        </h6>
                        <p className="fw-medium mb-1">{selectedDelivery.restaurant}</p>
                        <p className="small mb-2">{selectedDelivery.restaurantAddress}</p>
                        <p className="text-muted small mb-0">
                          Pickup time: {formatDate(selectedDelivery.pickupTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="d-flex align-items-center text-success mb-2">
                          <MapPin size={18} className="me-2" /> Delivery Details
                        </h6>
                        <p className="fw-medium mb-1">{selectedDelivery.customer}</p>
                        <p className="small mb-2">{selectedDelivery.address}</p>
                        <p className="text-muted small mb-1">
                          Phone: {selectedDelivery.contactNumber}
                        </p>
                        <p className="text-muted small mb-1">
                          Est. delivery: {formatDate(selectedDelivery.estimatedDeliveryTime)}
                        </p>
                        {selectedDelivery.actualDeliveryTime && (
                          <p className="text-muted small mb-0">
                            Actual delivery: {formatDate(selectedDelivery.actualDeliveryTime)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card bg-light mb-3">
                      <div className="card-body">
                        <h6 className="mb-2">Order Items</h6>
                        <ul className="list-group list-group-flush">
                          {selectedDelivery.items.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between px-0">
                              <span>{item.name}</span>
                              <span className="text-muted">×{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {assignedDriver ? (
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="d-flex align-items-center text-purple mb-2">
                            <User size={18} className="me-2" /> Driver Information
                          </h6>
                          <p className="fw-medium mb-1">{assignedDriver.name}</p>
                          <p className="small mb-2">Vehicle: {assignedDriver.vehicle} {assignedDriver.licensePlate}</p>
                          <div className="d-flex align-items-center mb-2">
                            <div className={`rounded-circle me-2 ${
                              assignedDriver.status === 'available' ? 'bg-success' : 
                              assignedDriver.status === 'busy' ? 'bg-warning' : 
                              'bg-secondary'
                            }`} style={{width: '8px', height: '8px'}}></div>
                            <span className="small">{formatStatusText(assignedDriver.status)}</span>
                          </div>
                          <div className="d-flex gap-2">
                            <a 
                              href={`tel:${assignedDriver.phone}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <PhoneCall size={12} className="me-1" /> Call
                            </a>
                            <button 
                              onClick={() => handleViewDriver(assignedDriver.id)}
                              className="btn btn-sm btn-outline-secondary"
                            >
                              <User size={12} className="me-1" /> View Profile
                            </button>
                            {selectedDelivery.status === 'in_transit' && (
                              <button 
                                onClick={() => handleOpenReassignForm(selectedDelivery.id)}
                                className="btn btn-sm btn-outline-warning"
                              >
                                <TruckIcon size={12} className="me-1" /> Reassign
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="d-flex align-items-center text-warning mb-2">
                            <AlertCircle size={18} className="me-2" /> No Driver Assigned
                          </h6>
                          {selectedDelivery.status !== 'cancelled' && (
                            <button 
                              onClick={() => handleOpenReassignForm(selectedDelivery.id)}
                              className="btn btn-primary w-100"
                            >
                              <TruckIcon size={16} className="me-2" /> Assign Driver
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {selectedDelivery.specialInstructions && (
                      <div className="alert alert-warning mt-3">
                        <p className="small mb-0 d-flex align-items-start">
                          <MessageCircle size={16} className="me-2 flex-shrink-0 mt-1" />
                          <span>{selectedDelivery.specialInstructions}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="card bg-light">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <span className="small fw-medium">Distance:</span>
                      <span className="small ms-1">{selectedDelivery.distance} mi</span>
                    </div>
                    <div>
                      <span className="small fw-medium">ETA:</span>
                      <span className="small ms-1">{calculateETA(selectedDelivery)}</span>
                    </div>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(selectedDelivery.restaurantAddress)}&destination=${encodeURIComponent(selectedDelivery.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="small text-primary"
                    >
                      <Navigation size={16} className="me-1" /> View Route
                      <ExternalLink size={12} className="ms-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedDelivery.status === 'ready' && (
                <button 
                  onClick={() => handleCancelDelivery(selectedDelivery.id)}
                  className="btn btn-danger"
                >
                  <X size={16} className="me-1" /> Cancel Delivery
                </button>
              )}
              
              {selectedDelivery.status === 'in_transit' && (
                <>
                  <button 
                    onClick={() => handleMarkDelivered(selectedDelivery.id)}
                    className="btn btn-success"
                  >
                    <CheckCircle size={16} className="me-1" /> Mark as Delivered
                  </button>
                  <button 
                    onClick={() => handleCancelDelivery(selectedDelivery.id)}
                    className="btn btn-danger"
                  >
                    <X size={16} className="me-1" /> Cancel Delivery
                  </button>
                </>
              )}
              
              <button 
                onClick={handleCloseDeliveryDetails}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show"></div>
      </div>
    );
  };

  // Driver Details Modal Component
  const DriverDetailsModal = () => {
    if (!selectedDriver) return null;
    
    // Count active deliveries for this driver
    const activeDeliveries = deliveries.filter(d => d.driver === selectedDriver.id && d.status === 'in_transit').length;
    
    return (
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Driver Profile</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleCloseDriverDetails}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '64px', height: '64px'}}>
                      <User size={32} className="text-secondary" />
                    </div>
                    <div>
                      <h5 className="mb-1">{selectedDriver.name}</h5>
                      <div className="d-flex align-items-center">
                        <div className={`rounded-circle me-2 ${
                          selectedDriver.status === 'available' ? 'bg-success' : 
                          selectedDriver.status === 'busy' ? 'bg-warning' : 
                          'bg-secondary'
                        }`} style={{width: '8px', height: '8px'}}></div>
                        <span className={`badge ${getDriverStatusBadgeClass(selectedDriver.status)}`}>
                          {formatStatusText(selectedDriver.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Contact Information</h6>
                    <p className="d-flex align-items-center mb-2">
                      <PhoneCall size={16} className="me-2 text-muted" />
                      <a href={`tel:${selectedDriver.phone}`} className="text-primary">
                        {selectedDriver.phone}
                      </a>
                    </p>
                    <p className="d-flex align-items-center mb-2">
                      <Mail size={16} className="me-2 text-muted" />
                      <a href={`mailto:${selectedDriver.email}`} className="text-primary">
                        {selectedDriver.email}
                      </a>
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Vehicle Information</h6>
                    <p className="mb-1">
                      <span className="fw-medium">Type:</span> {selectedDriver.vehicle}
                    </p>
                    {selectedDriver.licensePlate && (
                      <p className="mb-1">
                        <span className="fw-medium">License Plate:</span> {selectedDriver.licensePlate}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h6 className="text-muted mb-2">Service Area</h6>
                    <p>{selectedDriver.area}</p>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card bg-light mb-3">
                    <div className="card-body">
                      <h6 className="mb-3">Performance</h6>
                      <div className="row g-3">
                        <div className="col-6">
                          <p className="text-muted small mb-1">Rating</p>
                          <p className="fs-4 fw-medium d-flex align-items-center mb-0">
                            {selectedDriver.rating}
                            <span className="text-warning ms-1">★</span>
                            </p>
                        </div>
                        <div className="col-6">
                          <p className="text-muted small mb-1">Deliveries</p>
                          <p className="fs-4 fw-medium mb-0">{selectedDriver.deliveryCount}</p>
                        </div>
                        <div className="col-6">
                          <p className="text-muted small mb-1">Active Deliveries</p>
                          <p className="fs-4 fw-medium mb-0">{activeDeliveries}</p>
                        </div>
                        <div className="col-6">
                          <p className="text-muted small mb-1">Last Active</p>
                          <p className="small fw-medium mb-0">{formatDate(selectedDriver.lastActive)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="text-muted mb-2">Actions</h6>
                    <div className="row g-2">
                      <div className="col-6">
                        <button 
                          className={`btn ${
                            selectedDriver.status === 'offline' 
                              ? 'btn-success' 
                              : 'btn-light'
                          } w-100 d-flex align-items-center justify-content-center`}
                          onClick={() => handleDriverStatusUpdate(selectedDriver.id, 'available')}
                          disabled={selectedDriver.status === 'available'}
                        >
                          <ArrowUpCircle size={16} className="me-2" />
                          Set Available
                        </button>
                      </div>
                      <div className="col-6">
                        <button 
                          className={`btn ${
                            selectedDriver.status !== 'offline' 
                              ? 'btn-secondary' 
                              : 'btn-light'
                          } w-100 d-flex align-items-center justify-content-center`}
                          onClick={() => handleDriverStatusUpdate(selectedDriver.id, 'offline')}
                          disabled={selectedDriver.status === 'offline'}
                        >
                          <Clock size={16} className="me-2" />
                          Set Offline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <h6 className="mb-3">Current Assignments</h6>
                {deliveries.filter(d => d.driver === selectedDriver.id && d.status === 'in_transit').length > 0 ? (
                  <div className="list-group">
                    {deliveries
                      .filter(d => d.driver === selectedDriver.id && d.status === 'in_transit')
                      .map(delivery => (
                        <div key={delivery.id} className="list-group-item bg-warning bg-opacity-10">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <p className="fw-medium mb-0">{delivery.restaurant} → {delivery.customer}</p>
                              <p className="text-muted small mb-2">{delivery.id} - {delivery.orderId}</p>
                            </div>
                            <button 
                              className="btn btn-sm btn-link"
                              onClick={() => handleViewDelivery(delivery.id)}
                            >
                              View
                            </button>
                          </div>
                          <div className="d-flex gap-2">
                            <span className="badge bg-primary text-white">
                              {delivery.distance} mi
                            </span>
                            <span className="badge bg-success text-white">
                              ETA: {calculateETA(delivery)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted small p-3 bg-light rounded">No current assignments.</p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={handleCloseDriverDetails}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show"></div>
      </div>
    );
  };

  // Reassign Delivery Modal Component
  const ReassignDeliveryModal = () => {
    if (!selectedDelivery) return null;
    
    // Filter available drivers (not offline)
    const availableDrivers = drivers.filter(driver => driver.status !== 'offline');
    
    return (
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedDelivery.driver ? 'Reassign Delivery' : 'Assign Driver'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowReassignForm(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <p className="mb-1"><span className="fw-medium">Delivery:</span> {selectedDelivery.id}</p>
                <p className="mb-1"><span className="fw-medium">From:</span> {selectedDelivery.restaurant}</p>
                <p className="mb-1"><span className="fw-medium">To:</span> {selectedDelivery.customer}</p>
                <p className="mb-1"><span className="fw-medium">Distance:</span> {selectedDelivery.distance} mi</p>
              </div>
              
              <div>
                <h6 className="mb-3">Select Driver</h6>
                {availableDrivers.length > 0 ? (
                  <div className="list-group overflow-auto" style={{maxHeight: '240px'}}>
                    {availableDrivers.map(driver => (
                      <button 
                        key={driver.id}
                        type="button"
                        className={`list-group-item list-group-item-action d-flex align-items-center ${
                          selectedDriverForAssignment === driver.id 
                            ? 'active' 
                            : ''
                        }`}
                        onClick={() => setSelectedDriverForAssignment(driver.id)}
                      >
                        <div className={`rounded-circle me-3 ${
                          driver.status === 'available' ? 'bg-success' : 'bg-warning'
                        }`} style={{width: '12px', height: '12px'}}></div>
                        <div className="flex-grow-1">
                          <p className="fw-medium mb-0">{driver.name}</p>
                          <div className="d-flex align-items-center text-muted small">
                            <TruckIcon size={14} className="me-1" /> {driver.vehicle}
                            <span className="mx-2">•</span>
                            <span>{driver.area}</span>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="d-flex align-items-center">
                            <span className="fw-medium">{driver.rating}</span>
                            <span className="text-warning ms-1">★</span>
                          </div>
                          <p className="text-muted small mb-0">{driver.deliveryCount} deliveries</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small p-3 bg-light rounded">No available drivers at the moment.</p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowReassignForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleAssignDriver(selectedDelivery.id, selectedDriverForAssignment)}
                className="btn btn-primary"
                disabled={!selectedDriverForAssignment}
              >
                <Check size={16} className="me-1" /> Assign Driver
              </button>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show"></div>
      </div>
    );
  };

  return (
    <AdminLayout title="Delivery Management">
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3">Delivery Management</h1>
        </div>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-6 col-lg-3">
            <div className="card">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Active Deliveries</p>
                  <p className="h3 mb-1">
                    {deliveries.filter(d => d.status === 'in_transit').length}
                  </p>
                  <p className="text-muted small mb-0">
                    {deliveries.filter(d => d.status === 'ready').length} ready for pickup
                  </p>
                </div>
                <div className="p-2 bg-primary bg-opacity-10 rounded text-primary">
                  <TruckIcon size={24} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <div className="card">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Available Drivers</p>
                  <p className="h3 mb-1">
                    {drivers.filter(d => d.status === 'available').length}
                  </p>
                  <p className="text-muted small mb-0">
                    {drivers.filter(d => d.status === 'busy').length} drivers on delivery
                  </p>
                </div>
                <div className="p-2 bg-success bg-opacity-10 rounded text-success">
                  <User size={24} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <div className="card">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Today's Deliveries</p>
                  <p className="h3 mb-1">
                    {deliveries.filter(d => d.status === 'delivered' && 
                      (d.actualDeliveryTime && new Date(d.actualDeliveryTime).toISOString().split('T')[0] === new Date().toISOString().split('T')[0])).length}
                  </p>
                  <p className="text-muted small mb-0">
                    {deliveries.filter(d => d.status === 'cancelled').length} cancelled orders
                  </p>
                </div>
                <div className="p-2 bg-info bg-opacity-10 rounded text-info">
                  <Calendar size={24} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <div className="card">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Avg. Delivery Time</p>
                  <p className="h3 mb-1">24 min</p>
                  <p className="text-success small mb-0">
                    ↓ 2 min from last week
                  </p>
                </div>
                <div className="p-2 bg-warning bg-opacity-10 rounded text-warning">
                  <Clock size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search deliveries or drivers..."
                    className="form-control"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="row g-2">
                  <div className="col-md-4">
                    <select 
                      className="form-select"
                      value={filters.deliveryStatus}
                      onChange={(e) => setFilters({...filters, deliveryStatus: e.target.value})}
                    >
                      <option value="all">All Delivery Status</option>
                      <option value="ready">Ready for Pickup</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="col-md-4">
                    <select 
                      className="form-select"
                      value={filters.driverStatus}
                      onChange={(e) => setFilters({...filters, driverStatus: e.target.value})}
                    >
                      <option value="all">All Driver Status</option>
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  
                  <div className="col-md-4">
                    <input 
                      type="date" 
                      className="form-control"
                      value={filters.date}
                      onChange={(e) => setFilters({...filters, date: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deliveries Section */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title">Active Deliveries</h5>
              <span className="text-muted small">
                {filteredDeliveries.length} deliveries found
              </span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Restaurant</th>
                    <th>Customer</th>
                    <th>Driver</th>
                    <th>Distance</th>
                    <th>ETA</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDeliveries.map(delivery => {
                    const assignedDriver = drivers.find(driver => driver.id === delivery.driver);
                    
                    return (
                      <tr key={delivery.id}>
                        <td className="fw-medium">{delivery.id}</td>
                        <td>{delivery.restaurant}</td>
                        <td>{delivery.customer}</td>
                        <td>
                          {assignedDriver ? (
                            <div className="d-flex align-items-center">
                              <div className={`rounded-circle me-2 ${
                                assignedDriver.status === 'available' ? 'bg-success' : 
                                assignedDriver.status === 'busy' ? 'bg-warning' : 
                                'bg-secondary'
                              }`} style={{width: '8px', height: '8px'}}></div>
                              <span>{assignedDriver.name}</span>
                            </div>
                          ) : (
                            <span className="text-warning">Unassigned</span>
                          )}
                        </td>
                        <td>{delivery.distance} mi</td>
                        <td>{calculateETA(delivery)}</td>
                        <td>
                          <span className={`badge ${getDeliveryStatusBadgeClass(delivery.status)}`}>
                            {formatStatusText(delivery.status)}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary"
                              onClick={() => handleViewDelivery(delivery.id)}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            
                            {delivery.status === 'ready' && (
                              <button 
                                className="btn btn-outline-success"
                                onClick={() => handleOpenReassignForm(delivery.id)}
                                title="Assign Driver"
                              >
                                <TruckIcon size={16} />
                              </button>
                            )}
                            
                            {delivery.status === 'in_transit' && (
                              <button 
                                className="btn btn-outline-success"
                                onClick={() => handleMarkDelivered(delivery.id)}
                                title="Mark as Delivered"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            
                            {(delivery.status === 'ready' || delivery.status === 'in_transit') && (
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => handleCancelDelivery(delivery.id)}
                                title="Cancel Delivery"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {currentDeliveries.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-3 text-muted">
                        No deliveries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination for Deliveries */}
            {filteredDeliveries.length > itemsPerPage && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted small">
                  Showing {indexOfFirstDelivery + 1} to {Math.min(indexOfLastDelivery, filteredDeliveries.length)} of {filteredDeliveries.length} entries
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination pagination-sm">
                    <li className={`page-item ${currentDeliveryPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentDeliveryPage(prev => Math.max(prev - 1, 1))}
                        aria-label="Previous"
                      >
                        <ChevronLeft size={16} />
                      </button>
                    </li>
                    {Array.from({ length: Math.min(totalDeliveryPages, 5) }).map((_, index) => {
                      // Show pages around current page
                      let pageToShow = currentDeliveryPage;
                      if (totalDeliveryPages <= 5) {
                        pageToShow = index + 1;
                      } else if (currentDeliveryPage <= 3) {
                        pageToShow = index + 1;
                      } else if (currentDeliveryPage >= totalDeliveryPages - 2) {
                        pageToShow = totalDeliveryPages - 4 + index;
                      } else {
                        pageToShow = currentDeliveryPage - 2 + index;
                      }
                      
                      return (
                        <li key={pageToShow} className={`page-item ${currentDeliveryPage === pageToShow ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => setCurrentDeliveryPage(pageToShow)}
                          >
                            {pageToShow}
                          </button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${currentDeliveryPage === totalDeliveryPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentDeliveryPage(prev => Math.min(prev + 1, totalDeliveryPages))}
                        aria-label="Next"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Drivers Section */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title">Drivers</h5>
              <span className="text-muted small">
                {filteredDrivers.length} drivers found
              </span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Driver</th>
                    <th>Contact</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Area</th>
                    <th>Rating</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDrivers.map(driver => {
                    // Count active deliveries for this driver
                    const activeDeliveries = deliveries.filter(d => d.driver === driver.id && d.status === 'in_transit').length;
                    
                    return (
                      <tr key={driver.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '32px', height: '32px'}}>
                              <User size={16} className="text-secondary" />
                            </div>
                            <div>
                              <div className="fw-medium">{driver.name}</div>
                              <div className="text-muted small">{activeDeliveries > 0 ? `${activeDeliveries} active deliveries` : 'No active deliveries'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <a href={`tel:${driver.phone}`} className="text-primary">{driver.phone}</a>
                        </td>
                        <td>{driver.vehicle} {driver.licensePlate}</td>
                        <td>
                          <span className={`badge ${getDriverStatusBadgeClass(driver.status)}`}>
                            {formatStatusText(driver.status)}
                          </span>
                        </td>
                        <td>{driver.area}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="fw-medium me-1">{driver.rating}</span>
                            <span className="text-warning">★</span>
                            <span className="text-muted small ms-1">({driver.deliveryCount})</span>
                          </div>
                        </td>
                        <td className="text-muted small">
                          {formatDate(driver.lastActive)}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary"
                              onClick={() => handleViewDriver(driver.id)}
                              title="View Profile"
                            >
                              <Eye size={16} />
                            </button>
                            
                            {driver.status !== 'offline' && (
                              <button 
                                className="btn btn-outline-secondary"
                                onClick={() => handleDriverStatusUpdate(driver.id, 'offline')}
                                title="Set Offline"
                              >
                                <Clock size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {currentDrivers.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-3 text-muted">
                        No drivers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination for Drivers */}
            {filteredDrivers.length > itemsPerPage && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted small">
                  Showing {indexOfFirstDriver + 1} to {Math.min(indexOfLastDriver, filteredDrivers.length)} of {filteredDrivers.length} entries
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination pagination-sm">
                    <li className={`page-item ${currentDriverPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentDriverPage(prev => Math.max(prev - 1, 1))}
                        aria-label="Previous"
                      >
                        <ChevronLeft size={16} />
                      </button>
                    </li>
                    {Array.from({ length: Math.min(totalDriverPages, 5) }).map((_, index) => {
                      // Show pages around current page
                      let pageToShow = currentDriverPage;
                      if (totalDriverPages <= 5) {
                        pageToShow = index + 1;
                      } else if (currentDriverPage <= 3) {
                        pageToShow = index + 1;
                      } else if (currentDriverPage >= totalDriverPages - 2) {
                        pageToShow = totalDriverPages - 4 + index;
                      } else {
                        pageToShow = currentDriverPage - 2 + index;
                      }
                      
                      return (
                        <li key={pageToShow} className={`page-item ${currentDriverPage === pageToShow ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => setCurrentDriverPage(pageToShow)}
                          >
                            {pageToShow}
                          </button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${currentDriverPage === totalDriverPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentDriverPage(prev => Math.min(prev + 1, totalDriverPages))}
                        aria-label="Next"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
        
        {/* Dynamic Map Placeholder */}
        <div className="card mt-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title">Delivery Map</h5>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-secondary">
                  Refresh
                </button>
                <button className="btn btn-sm btn-primary">
                  Full Screen
                </button>
              </div>
            </div>
            <div className="bg-light rounded p-5 text-center">
              <Map size={48} className="text-muted mb-2" />
              <p className="text-muted mb-1">Interactive map would be displayed here</p>
              <p className="text-muted small">Showing driver locations and delivery routes</p>
            </div>
          </div>
        </div>
        
        {showDeliveryDetails && <DeliveryDetailsModal />}
        
        {showDriverDetails && <DriverDetailsModal />}
        
        {showReassignForm && <ReassignDeliveryModal />}
      </div>
    </AdminLayout>
  );
};

export default DeliveryManagement;