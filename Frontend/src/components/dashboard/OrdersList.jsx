import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Badge, Dropdown } from 'react-bootstrap';
import AdminLayout from '../layout/AdminLayout';
import { 
  Download, Search, Eye, Clock, X, Filter, ChevronLeft, ChevronRight,
  Truck, MapPin, ShoppingBag, DollarSign, Calendar, AlertCircle, RefreshCw,
  MessageCircle, Utensils
} from 'lucide-react';
import axios from 'axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    date: '',
    restaurant: 'all'
  });

  // Unique restaurants extracted from orders
  const [restaurants, setRestaurants] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Order details modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Status mapping based on the OrderStatus enum
  const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
  const ORDER_TYPES = ['DELIVERY', 'PICKUP'];

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Update restaurants list when orders change
  useEffect(() => {
    if (orders.length > 0) {
      const uniqueRestaurants = [...new Set(orders.map(order => order.restaurant?.id))]
        .filter(id => id)
        .map(id => {
          const restaurant = orders.find(order => order.restaurant?.id === id)?.restaurant;
          return restaurant;
        });
      setRestaurants(uniqueRestaurants);
    }
  }, [orders]);

  // Fetch all orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
        setError(null);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      
      if (err.response && err.response.status === 401) {
        window.location.href = '/login';
        return;
      }
      
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single order details
  const fetchOrderDetails = async (orderId) => {
    setLoadingDetails(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setOrderDetails(response.data.data);
      } else {
        alert('Failed to load order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      alert('Error loading order details. Please try again.');
    } finally {
      setLoadingDetails(false);
    }
  };

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Update the order in state
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        
        // If the order is selected, update its status too
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Error updating order status. Please try again.');
    }
  };

  // Function to view order details
  const handleViewOrder = (orderId) => {
    const order = orders.find(order => order.id === orderId);
    setSelectedOrder(order);
    setShowDetails(true);
    fetchOrderDetails(orderId);
  };

  // Function to close order details modal
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  // Function to export orders as CSV
  const handleExportOrders = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Order ID,Customer,Restaurant,Date,Total,Type,Status,Payment Method\n";
    
    // Add data rows
    filteredOrders.forEach(order => {
      const row = [
        order.orderNumber,
        order.customer?.name || "Guest",
        order.restaurant?.name,
        formatDate(order.createdAt),
        `£${parseFloat(order.total).toFixed(2)}`,
        order.orderType,
        order.status,
        order.paymentMethod
      ];
      
      csvContent += row.join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    
    // Download the CSV file
    link.click();
    document.body.removeChild(link);
  };

  // Filter orders based on filters
  const filteredOrders = orders.filter(order => {
    // Search filter - check order number, customer name, etc.
    const searchLower = filters.search.toLowerCase();
    const matchesSearch = (order.orderNumber?.toLowerCase().includes(searchLower) || 
                           order.restaurant?.name?.toLowerCase().includes(searchLower));
    
    // Status filter
    const matchesStatus = filters.status === 'all' || order.status === filters.status;
    
    // Type filter
    const matchesType = filters.type === 'all' || order.orderType === filters.type;
    
    // Restaurant filter
    const matchesRestaurant = filters.restaurant === 'all' || order.restaurant?.id === filters.restaurant;
    
    // Date filter - check if the order date contains the filter date
    const matchesDate = !filters.date || order.createdAt.includes(filters.date);
    
    return matchesSearch && matchesStatus && matchesType && matchesRestaurant && matchesDate;
  });

  // Get current orders for pagination
  const liveOrders = filteredOrders.filter(order => !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(order.status));
  const historyOrders = filteredOrders.filter(order => ['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(order.status));
  
  // Calculate pagination for live orders
  const indexOfLastLive = currentPage * itemsPerPage;
  const indexOfFirstLive = indexOfLastLive - itemsPerPage;
  const currentLiveOrders = liveOrders.slice(indexOfFirstLive, indexOfLastLive);
  const totalLivePages = Math.ceil(liveOrders.length / itemsPerPage);
  
  // Calculate pagination for history orders
  const indexOfLastHistory = historyPage * itemsPerPage;
  const indexOfFirstHistory = indexOfLastHistory - itemsPerPage;
  const currentHistoryOrders = historyOrders.slice(indexOfFirstHistory, indexOfLastHistory);
  const totalHistoryPages = Math.ceil(historyOrders.length / itemsPerPage);

  // Function to get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'PENDING':
        return 'primary';
      case 'CONFIRMED':
        return 'warning';
      case 'PREPARING':
        return 'info';
      case 'READY':
        return 'info';
      case 'DELIVERING':
        return 'secondary';
      case 'DELIVERED':
        return 'success';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Function to format the status text
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total amount from order items
  const calculateTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      date: '',
      restaurant: 'all'
    });
  };

  if (loading && orders.length === 0) {
    return (
      <AdminLayout title="Orders Management">
        <div className="container-fluid p-4 text-center">
          <div className="spinner-border text-warning mt-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading orders...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Orders Management">
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-0">Orders Management</h1>
            <p className="text-muted">Manage and track all customer orders</p>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={fetchOrders}
              disabled={loading}
            >
              <RefreshCw size={18} className={`me-1 ${loading ? 'spinner' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="warning" 
              onClick={handleExportOrders}
              className="d-flex align-items-center"
            >
              <Download size={18} className="me-1" />
              Export Orders
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
                    placeholder="Search by order number or restaurant..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="d-flex gap-2">
                  <Form.Select 
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="all">All Status</option>
                    {ORDER_STATUSES.map(status => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </Form.Select>
                  
                  <Form.Select 
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                  >
                    <option value="all">All Types</option>
                    {ORDER_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </Form.Select>
                  
                  <Form.Select 
                    value={filters.restaurant}
                    onChange={(e) => setFilters({...filters, restaurant: e.target.value})}
                  >
                    <option value="all">All Restaurants</option>
                    {restaurants.map(restaurant => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
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

        {/* Live Orders Section */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center bg-warning bg-opacity-10">
            <h5 className="mb-0">Active Orders</h5>
            <span className="badge bg-warning text-dark">
              {liveOrders.length} active orders
            </span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <Table hover>
                <thead className="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Restaurant</th>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLiveOrders.length > 0 ? (
                    currentLiveOrders.map(order => (
                      <tr key={order.id}>
                        <td className="fw-medium">{order.orderNumber}</td>
                        <td>{order.restaurant?.name || 'Unknown'}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          <Badge bg={order.orderType === 'DELIVERY' ? 'primary' : 'success'} text="white">
                            {order.orderType === 'DELIVERY' ? 'Delivery' : 'Pickup'}
                          </Badge>
                        </td>
                        <td>£{parseFloat(order.total).toFixed(2)}</td>
                        <td>
                          <Badge bg={order.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                            {order.paymentMethod} ({order.paymentStatus})
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(order.status)}>
                            {formatStatus(order.status)}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewOrder(order.id)}
                              title="View Order Details"
                            >
                              <Eye size={16} />
                            </Button>
                            
                            <Dropdown>
                              <Dropdown.Toggle 
                                variant="outline-warning" 
                                size="sm"
                                id={`status-dropdown-${order.id}`}
                                title="Update Status"
                              >
                                <Clock size={16} />
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <Dropdown.Header>Update Status:</Dropdown.Header>
                                {ORDER_STATUSES
                                  .filter(status => status !== order.status)
                                  .map(status => (
                                    <Dropdown.Item
                                      key={status}
                                      onClick={() => handleStatusUpdate(order.id, status)}
                                    >
                                      {formatStatus(status)}
                                    </Dropdown.Item>
                                  ))
                                }
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="text-muted">
                          <AlertCircle size={24} className="mb-2" />
                          <p>No active orders found</p>
                          {(filters.search || filters.status !== 'all' || filters.type !== 'all' || filters.restaurant !== 'all') && (
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
          
          {/* Pagination for Live Orders */}
          {liveOrders.length > itemsPerPage && (
            <div className="card-footer d-flex justify-content-between align-items-center">
              <div className="small text-muted">
                Showing {indexOfFirstLive + 1} to {Math.min(indexOfLastLive, liveOrders.length)} of {liveOrders.length} entries
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
                  {Array.from({ length: totalLivePages }).map((_, index) => (
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
                  <li className={`page-item ${currentPage === totalLivePages ? 'disabled' : ''}`}>
                    <Button 
                      variant="link" 
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalLivePages))}
                      disabled={currentPage === totalLivePages}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>

        {/* Order History Section */}
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center bg-secondary bg-opacity-10">
            <h5 className="mb-0">Order History</h5>
            <span className="badge bg-secondary">
              {historyOrders.length} completed orders
            </span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <Table hover>
                <thead className="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Restaurant</th>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentHistoryOrders.length > 0 ? (
                    currentHistoryOrders.map(order => (
                      <tr key={order.id}>
                        <td className="fw-medium">{order.orderNumber}</td>
                        <td>{order.restaurant?.name || 'Unknown'}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          <Badge bg={order.orderType === 'DELIVERY' ? 'primary' : 'success'} text="white">
                            {order.orderType === 'DELIVERY' ? 'Delivery' : 'Pickup'}
                          </Badge>
                        </td>
                        <td>£{parseFloat(order.total).toFixed(2)}</td>
                        <td>
                          <Badge bg={order.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                            {order.paymentMethod} ({order.paymentStatus})
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(order.status)}>
                            {formatStatus(order.status)}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewOrder(order.id)}
                            title="View Order Details"
                          >
                            <Eye size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="text-muted">
                          <AlertCircle size={24} className="mb-2" />
                          <p>No order history found</p>
                          {(filters.search || filters.status !== 'all' || filters.type !== 'all' || filters.restaurant !== 'all') && (
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
          
          {/* Pagination for Order History */}
          {historyOrders.length > itemsPerPage && (
            <div className="card-footer d-flex justify-content-between align-items-center">
              <div className="small text-muted">
                Showing {indexOfFirstHistory + 1} to {Math.min(indexOfLastHistory, historyOrders.length)} of {historyOrders.length} entries
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${historyPage === 1 ? 'disabled' : ''}`}>
                    <Button 
                      variant="link" 
                      className="page-link"
                      onClick={() => setHistoryPage(prev => Math.max(prev - 1, 1))}
                      disabled={historyPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                  </li>
                  {Array.from({ length: totalHistoryPages }).map((_, index) => (
                    <li key={index} className={`page-item ${historyPage === index + 1 ? 'active' : ''}`}>
                      <Button 
                        variant={historyPage === index + 1 ? 'primary' : 'link'} 
                        className="page-link"
                        onClick={() => setHistoryPage(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    </li>
                  ))}
                  <li className={`page-item ${historyPage === totalHistoryPages ? 'disabled' : ''}`}>
                    <Button 
                      variant="link" 
                      className="page-link"
                      onClick={() => setHistoryPage(prev => Math.min(prev + 1, totalHistoryPages))}
                      disabled={historyPage === totalHistoryPages}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
        
        {/* Order Details Modal */}
        <Modal show={showDetails} onHide={handleCloseDetails} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Order Details - {selectedOrder?.orderNumber}
              {selectedOrder && (
                <Badge 
                  className="ms-2" 
                  bg={getStatusBadgeVariant(selectedOrder.status)}
                >
                  {formatStatus(selectedOrder.status)}
                </Badge>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingDetails ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading order details...</p>
              </div>
            ) : selectedOrder ? (
              <>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5 className="text-secondary mb-3">Order Information</h5>
                    <div className="mb-2 d-flex align-items-start">
                      <Calendar size={18} className="me-2 text-primary mt-1" />
                      <div>
                        <div className="fw-medium">Date & Time</div>
                        <div>{formatDate(selectedOrder.createdAt)}</div>
                      </div>
                    </div>
                    <div className="mb-2 d-flex align-items-start">
                      <ShoppingBag size={18} className="me-2 text-primary mt-1" />
                      <div>
                        <div className="fw-medium">Order Type</div>
                        <div>{selectedOrder.orderType === 'DELIVERY' ? 'Delivery' : 'Pickup'}</div>
                      </div>
                    </div>
                    {selectedOrder.scheduledTime && (
                      <div className="mb-2 d-flex align-items-start">
                        <Clock size={18} className="me-2 text-primary mt-1" />
                        <div>
                          <div className="fw-medium">Scheduled Time</div>
                          <div>{formatDate(selectedOrder.scheduledTime)}</div>
                        </div>
                      </div>
                    )}
                    <div className="mb-2 d-flex align-items-start">
                      <DollarSign size={18} className="me-2 text-primary mt-1" />
                      <div>
                        <div className="fw-medium">Payment</div>
                        <div>{selectedOrder.paymentMethod} - {selectedOrder.paymentStatus}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h5 className="text-secondary mb-3">Restaurant & Delivery</h5>
                    <div className="mb-2 d-flex align-items-start">
                      <Utensils size={18} className="me-2 text-primary mt-1" />
                      <div>
                        <div className="fw-medium">Restaurant</div>
                        <div>{selectedOrder.restaurant?.name}</div>
                        <div className="small text-muted">{selectedOrder.restaurant?.address}</div>
                      </div>
                    </div>
                    
                    {selectedOrder.orderType === 'DELIVERY' && (
                      <div className="mb-2 d-flex align-items-start">
                        <MapPin size={18} className="me-2 text-primary mt-1" />
                        <div>
                          <div className="fw-medium">Delivery Address</div>
                          <div>
                            {selectedOrder.addressDetails}, {selectedOrder.address}
                          </div>
                          <div>
                            {selectedOrder.city}, {selectedOrder.postcode}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedOrder.notes && (
                      <div className="mb-2 d-flex align-items-start">
                        <MessageCircle size={18} className="me-2 text-primary mt-1" />
                        <div>
                          <div className="fw-medium">Notes</div>
                          <div>{selectedOrder.notes}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <h5 className="text-secondary mb-3">Order Items</h5>
                <Table striped bordered>
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '55%' }}>Item</th>
                      <th className="text-center" style={{ width: '15%' }}>Quantity</th>
                      <th className="text-end" style={{ width: '15%' }}>Price</th>
                      <th className="text-end" style={{ width: '15%' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems?.map((item) => (
                      <tr key={item.id}>
                      <td>
                        <div className="fw-medium">{item.menuItem?.name}</div>
                        {item.notes && <div className="small text-muted">Note: {item.notes}</div>}
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">£{parseFloat(item.price).toFixed(2)}</td>
                      <td className="text-end">£{(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <td colSpan="3" className="text-end fw-medium">Subtotal:</td>
                    <td className="text-end">£{calculateTotal(selectedOrder.orderItems).toFixed(2)}</td>
                  </tr>
                  {selectedOrder.deliveryFee && (
                    <tr>
                      <td colSpan="3" className="text-end">Delivery Fee:</td>
                      <td className="text-end">£{parseFloat(selectedOrder.deliveryFee).toFixed(2)}</td>
                    </tr>
                  )}
                  {selectedOrder.tip && parseFloat(selectedOrder.tip) > 0 && (
                    <tr>
                      <td colSpan="3" className="text-end">Tip:</td>
                      <td className="text-end">£{parseFloat(selectedOrder.tip).toFixed(2)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="3" className="text-end fw-bold">Total:</td>
                    <td className="text-end fw-bold">£{parseFloat(selectedOrder.total).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </Table>
            </>
          ) : (
            <div className="text-center py-4 text-muted">
              <AlertCircle size={24} className="mb-2" />
              <p>Order details not available</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedOrder && !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(selectedOrder.status) && (
            <div className="me-auto">
              <Dropdown>
                <Dropdown.Toggle variant="warning" id="dropdown-status">
                  Update Status
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {ORDER_STATUSES
                    .filter(status => status !== selectedOrder.status)
                    .map(status => (
                      <Dropdown.Item
                        key={status}
                        onClick={() => {
                          handleStatusUpdate(selectedOrder.id, status);
                        }}
                      >
                        {formatStatus(status)}
                      </Dropdown.Item>
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
            </div>
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

export default OrdersList;