import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Bell, Check, Trash, Filter, Calendar, Clock, CheckCircle, AlertCircle, AlertTriangle, Info, ShoppingBag, User, MapPin, MessageSquare } from 'lucide-react';

const AdminNotifications = () => {
  // Sample notification data
  const initialNotifications = [
    {
      id: 1,
      type: 'order',
      title: 'New order received',
      message: 'Order #ORD-2024-056 has been placed for Italian Bistro',
      timestamp: '2024-03-14T14:30:00',
      read: false,
      priority: 'medium'
    },
    {
      id: 2,
      type: 'restaurant',
      title: 'Restaurant approval request',
      message: 'New restaurant "The Green Garden" has requested approval',
      timestamp: '2024-03-14T12:15:00',
      read: false,
      priority: 'high'
    },
    {
      id: 3,
      type: 'system',
      title: 'System maintenance completed',
      message: 'The scheduled system maintenance has been completed successfully',
      timestamp: '2024-03-14T10:00:00',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'booking',
      title: 'Booking conflict detected',
      message: 'Multiple bookings detected for Table 5 at Sushiteria on March 16, 7:30 PM',
      timestamp: '2024-03-13T18:45:00',
      read: false,
      priority: 'high'
    },
    {
      id: 5,
      type: 'order',
      title: 'Order cancellation',
      message: 'Order #ORD-2024-052 has been cancelled by the customer',
      timestamp: '2024-03-13T16:20:00',
      read: true,
      priority: 'medium'
    },
    {
      id: 6,
      type: 'user',
      title: 'New staff account created',
      message: 'New staff account for Maria Garcia has been created',
      timestamp: '2024-03-13T15:10:00',
      read: true,
      priority: 'medium'
    },
    {
      id: 7,
      type: 'delivery',
      title: 'Delayed delivery reported',
      message: 'Delivery for Order #ORD-2024-049 is running late',
      timestamp: '2024-03-13T14:30:00',
      read: true,
      priority: 'high'
    },
    {
      id: 8,
      type: 'system',
      title: 'Database backup completed',
      message: 'Daily database backup has been completed successfully',
      timestamp: '2024-03-13T04:00:00',
      read: true,
      priority: 'low'
    },
    {
      id: 9,
      type: 'restaurant',
      title: 'Menu update',
      message: 'Italian Bistro has updated their menu with 5 new items',
      timestamp: '2024-03-12T11:25:00',
      read: true,
      priority: 'medium'
    },
    {
      id: 10,
      type: 'feedback',
      title: 'New customer feedback',
      message: 'A customer has left a 2-star review for Burger House',
      timestamp: '2024-03-12T09:15:00',
      read: false,
      priority: 'high'
    }
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  const [filters, setFilters] = useState({
    type: 'all',
    read: 'all',
    priority: 'all',
    search: ''
  });

  // Group notifications by date for display
  const groupNotificationsByDate = () => {
    const groups = {};
    
    filteredNotifications.forEach(notification => {
      const date = new Date(notification.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push(notification);
    });
    
    return groups;
  };

  // Apply filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filters.type === 'all' || notification.type === filters.type;
    const matchesRead = filters.read === 'all' || 
                        (filters.read === 'read' && notification.read) ||
                        (filters.read === 'unread' && !notification.read);
    const matchesPriority = filters.priority === 'all' || notification.priority === filters.priority;
    
    const matchesSearch = filters.search === '' || 
                          notification.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          notification.message.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesType && matchesRead && matchesPriority && matchesSearch;
  });

  const groupedNotifications = groupNotificationsByDate();

  // Calculate unread notification count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      setNotifications([]);
    }
  };

  // Clear all read notifications
  const clearReadNotifications = () => {
    if (window.confirm('Are you sure you want to delete all read notifications?')) {
      setNotifications(notifications.filter(notification => !notification.read));
    }
  };

  // Get the appropriate icon for a notification type
  const getNotificationIcon = (type, priority) => {
    const iconSize = 18;
    const iconClass = priority === 'high' ? 'text-danger' : 
                      priority === 'medium' ? 'text-warning' : 
                      'text-info';
    
    switch (type) {
      case 'order':
        return <ShoppingBag size={iconSize} className={iconClass} />;
      case 'restaurant':
        return <MapPin size={iconSize} className={iconClass} />;
      case 'system':
        return <Info size={iconSize} className={iconClass} />;
      case 'booking':
        return <Calendar size={iconSize} className={iconClass} />;
      case 'user':
        return <User size={iconSize} className={iconClass} />;
      case 'delivery':
        return <Clock size={iconSize} className={iconClass} />;
      case 'feedback':
        return <MessageSquare size={iconSize} className={iconClass} />;
      default:
        return <Bell size={iconSize} className={iconClass} />;
    }
  };

  // Format the timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <AdminLayout title="Notifications">
      <div className="container-fluid p-4">
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <Bell size={24} className="text-primary me-2" />
                <h2 className="h4 mb-0">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="badge bg-danger ms-2">{unreadCount} unread</span>
                )}
              </div>
              
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <Check size={16} className="me-1" /> Mark All Read
                </button>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={clearReadNotifications}
                  disabled={notifications.filter(n => n.read).length === 0}
                >
                  <Trash size={16} className="me-1" /> Clear Read
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={clearAllNotifications}
                  disabled={notifications.length === 0}
                >
                  <Trash size={16} className="me-1" /> Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-lg-9 order-lg-2">
            {/* Notifications Content */}
            <div className="card">
              <div className="card-body p-0">
                {notifications.length === 0 ? (
                  <div className="text-center py-5">
                    <Bell size={48} className="text-muted mb-3" />
                    <h5>No notifications</h5>
                    <p className="text-muted">You're all caught up!</p>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-5">
                    <Filter size={48} className="text-muted mb-3" />
                    <h5>No matching notifications</h5>
                    <p className="text-muted">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div>
                    {Object.keys(groupedNotifications).map(date => (
                      <div key={date}>
                        <div className="bg-light px-4 py-2 border-bottom">
                          <h6 className="mb-0 text-muted">{date}</h6>
                        </div>
                        <div>
                          {groupedNotifications[date].map(notification => (
                            <div 
                              key={notification.id} 
                              className={`border-bottom px-4 py-3 ${notification.read ? 'bg-white' : 'bg-light'}`}
                            >
                              <div className="d-flex">
                                <div className="me-3">
                                  {getNotificationIcon(notification.type, notification.priority)}
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h6 className={`mb-1 ${!notification.read ? 'fw-bold' : ''}`}>
                                      {notification.title}
                                    </h6>
                                    <div className="d-flex gap-2">
                                      {!notification.read && (
                                        <button 
                                          className="btn btn-link btn-sm text-primary p-0"
                                          onClick={() => markAsRead(notification.id)}
                                        >
                                          <Check size={16} />
                                        </button>
                                      )}
                                      <button 
                                        className="btn btn-link btn-sm text-danger p-0"
                                        onClick={() => deleteNotification(notification.id)}
                                      >
                                        <Trash size={16} />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="mb-1">{notification.message}</p>
                                  <small className="text-muted">{formatTimestamp(notification.timestamp)}</small>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 order-lg-1 mb-4 mb-lg-0">
            {/* Filters */}
            <div className="card sticky-top" style={{ top: '70px' }}>
              <div className="card-header bg-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <Filter size={16} className="me-2" /> Filters
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Search</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Search notifications..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select 
                    className="form-select"
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                  >
                    <option value="all">All Types</option>
                    <option value="order">Orders</option>
                    <option value="restaurant">Restaurants</option>
                    <option value="booking">Bookings</option>
                    <option value="delivery">Deliveries</option>
                    <option value="user">Users</option>
                    <option value="system">System</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={filters.read}
                    onChange={(e) => setFilters({...filters, read: e.target.value})}
                  >
                    <option value="all">All Status</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <select 
                    className="form-select"
                    value={filters.priority}
                    onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <button 
                  className="btn btn-primary w-100"
                  onClick={() => setFilters({type: 'all', read: 'all', priority: 'all', search: ''})}
                >
                  Reset Filters
                </button>
              </div>
              
              <div className="card-footer bg-white">
                <h6 className="mb-2">Priority Legend</h6>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center">
                    <AlertCircle size={16} className="text-danger me-2" />
                    <span>High Priority</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <AlertTriangle size={16} className="text-warning me-2" />
                    <span>Medium Priority</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Info size={16} className="text-info me-2" />
                    <span>Low Priority</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;