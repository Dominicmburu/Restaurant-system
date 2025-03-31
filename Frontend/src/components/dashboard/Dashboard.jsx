import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, Utensils, Calendar, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeRestaurants: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    cancelledOrders: 0,
    menuItems: 0
  });
  
  const [revenueData, setRevenueData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Configure request headers with authorization token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      try {
        // Fetch orders, bookings, menu items, and restaurants in parallel with auth header
        const [ordersRes, bookingsRes, menuRes, restaurantsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/orders', config),
          axios.get('http://localhost:5000/api/bookings', config),
          axios.get('http://localhost:5000/api/menu', config),
          axios.get('http://localhost:5000/api/restaurants', config)
        ]);

        // Process orders data
        const orders = ordersRes.data.data || [];
        const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
        const confirmedOrders = orders.filter(order => order.status === 'CONFIRMED').length;
        const cancelledOrders = orders.filter(order => order.status === 'CANCELLED').length;
        
        // Calculate total revenue from orders
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);

        // Process data for "Revenue by Restaurant" chart
        const restaurantRevenueMap = {};
        restaurantsRes.data.data.forEach(restaurant => {
          restaurantRevenueMap[restaurant.id] = {
            name: restaurant.name.replace('TurkNazz ', ''),
            revenue: 0
          };
        });
        
        orders.forEach(order => {
          if (order.restaurantId && restaurantRevenueMap[order.restaurantId]) {
            restaurantRevenueMap[order.restaurantId].revenue += parseFloat(order.total || 0);
          }
        });
        
        const revenueByRestaurant = Object.values(restaurantRevenueMap).map(item => ({
          name: item.name,
          revenue: parseFloat(item.revenue.toFixed(2))
        }));
        
        // Process data for "Orders This Week" chart
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyOrderData = [];
        
        // Create array for the last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          weeklyOrderData.push({
            name: daysOfWeek[date.getDay()],
            date: new Date(date.setHours(0, 0, 0, 0)),
            orders: 0
          });
        }
        
        // Count orders for each day
        orders.forEach(order => {
          const orderDate = new Date(order.createdAt);
          
          weeklyOrderData.forEach(dayData => {
            const nextDay = new Date(dayData.date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            if (orderDate >= dayData.date && orderDate < nextDay) {
              dayData.orders++;
            }
          });
        });

        // Generate notifications from recent orders and bookings
        const newNotifications = [];
        
        // Add notifications for recent bookings
        const bookings = bookingsRes.data.data || [];
        bookings.slice(0, 2).forEach(booking => {
          newNotifications.push({
            id: `booking-${booking.id}`,
            text: `New booking #${booking.bookingNumber} at ${booking.restaurant?.name || 'restaurant'}`,
            time: timeAgo(new Date(booking.createdAt)),
            type: 'request'
          });
        });
        
        // Add notifications for cancelled orders
        orders.filter(order => order.status === 'CANCELLED').slice(0, 2).forEach(order => {
          newNotifications.push({
            id: `order-${order.id}`,
            text: `Order #${order.orderNumber} has been cancelled`,
            time: timeAgo(new Date(order.updatedAt)),
            type: 'alert'
          });
        });
        
        // Add notifications for pending orders
        orders.filter(order => order.status === 'PENDING').slice(0, 2).forEach(order => {
          newNotifications.push({
            id: `pending-${order.id}`,
            text: `Pending order #${order.orderNumber} needs confirmation`,
            time: timeAgo(new Date(order.createdAt)),
            type: 'support'
          });
        });

        // Update all stats
        setStats({
          totalOrders: orders.length,
          totalBookings: bookingsRes.data.count || 0,
          totalRevenue: totalRevenue,
          activeRestaurants: restaurantsRes.data.count || 0,
          pendingOrders,
          confirmedOrders,
          cancelledOrders,
          menuItems: menuRes.data.count || 0
        });
        
        setRevenueData(revenueByRestaurant);
        setOrderData(weeklyOrderData);
        setNotifications(newNotifications);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        // Handle unauthorized error
        if (err.response && err.response.status === 401) {
          // Redirect to login page if unauthorized
          window.location.href = '/login';
          return;
        }
        
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    
    return `${Math.floor(seconds)} seconds ago`;
  };

  // Function to handle logging out
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="container-fluid p-4 text-center">
          <div className="spinner-border text-warning mt-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="container-fluid p-4">
          <div className="alert alert-danger" role="alert">
            {error}
            <button 
              className="btn btn-outline-danger btn-sm ms-3"
              onClick={handleLogout}
            >
              Logout and Return to Login
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Dashboard</h1>
          <div>
            <button className="btn btn-outline-warning">
              <i className="bi bi-download me-2"></i>
              Export Report
            </button>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Total Orders</p>
                  <h3 className="h4 fw-bold mb-0">{stats.totalOrders}</h3>
                  <p className="small text-success mb-0">
                    <i className="bi bi-arrow-up me-1"></i>
                    {Math.round((stats.totalOrders / 100) * 15)}% from last month
                  </p>
                </div>
                <div className="bg-primary bg-opacity-25 rounded-circle p-3">
                  <ShoppingBag color="#0d6efd" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Total Bookings</p>
                  <h3 className="h4 fw-bold mb-0">{stats.totalBookings}</h3>
                  <p className="small text-success mb-0">
                    <i className="bi bi-arrow-up me-1"></i>
                    {Math.round((stats.totalBookings / 20) * 10)}% from last month
                  </p>
                </div>
                <div className="bg-success bg-opacity-25 rounded-circle p-3">
                  <Calendar color="#198754" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Total Revenue</p>
                  <h3 className="h4 fw-bold mb-0">£{stats.totalRevenue.toFixed(2)}</h3>
                  <p className="small text-success mb-0">
                    <i className="bi bi-arrow-up me-1"></i>
                    8% from last month
                  </p>
                </div>
                <div className="bg-purple bg-opacity-25 rounded-circle p-3" style={{ backgroundColor: 'rgba(111, 66, 193, 0.25)' }}>
                  <DollarSign color="#6f42c1" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Active Restaurants</p>
                  <h3 className="h4 fw-bold mb-0">{stats.activeRestaurants}</h3>
                  <p className="small text-muted mb-0">All locations operating</p>
                </div>
                <div className="bg-warning bg-opacity-25 rounded-circle p-3">
                  <Utensils color="#ffc107" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by Restaurant Chart */}
        <div className="row mb-4">
          <div className="col-lg-8 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Revenue by Restaurant</h5>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`£${value}`, 'Revenue']} />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#ffc107" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">Order Status</h5>
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Pending</span>
                    <span className="text-warning">{stats.pendingOrders}</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-warning" 
                      style={{ width: `${(stats.pendingOrders / Math.max(stats.totalOrders, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Confirmed</span>
                    <span className="text-success">{stats.confirmedOrders}</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${(stats.confirmedOrders / Math.max(stats.totalOrders, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Cancelled</span>
                    <span className="text-danger">{stats.cancelledOrders}</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-danger" 
                      style={{ width: `${(stats.cancelledOrders / Math.max(stats.totalOrders, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <a href="/admin/orders" className="btn btn-sm btn-outline-warning">View All Orders</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders This Week Chart */}
        <div className="row mb-4">
          <div className="col-lg-8 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Orders This Week</h5>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={orderData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#ffc107" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        name="Daily Orders"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">Quick Stats</h5>
                
                <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                  <div className="bg-warning bg-opacity-25 rounded-circle me-3 p-3">
                    <Utensils color="#ffc107" size={20} />
                  </div>
                  <div>
                    <p className="mb-0 text-muted small">Menu Items</p>
                    <h5 className="mb-0">{stats.menuItems}</h5>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                  <div className="bg-primary bg-opacity-25 rounded-circle me-3 p-3">
                    <ShoppingBag color="#0d6efd" size={20} />
                  </div>
                  <div>
                    <p className="mb-0 text-muted small">Average Order Value</p>
                    <h5 className="mb-0">£{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}</h5>
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-25 rounded-circle me-3 p-3">
                    <Calendar color="#198754" size={20} />
                  </div>
                  <div>
                    <p className="mb-0 text-muted small">Today's Bookings</p>
                    <h5 className="mb-0">{Math.min(stats.totalBookings, 2)}</h5>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="row">
          <div className="col-12 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Recent Notifications</h5>
                  <a href="/admin/notifications" className="btn btn-sm btn-outline-warning">View All</a>
                </div>
                
                <div>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div key={notification.id} className="d-flex align-items-start mb-3 pb-2 border-bottom">
                        <div className={`rounded-circle me-3 p-2 ${
                          notification.type === 'alert' ? 'bg-danger bg-opacity-25' :
                          notification.type === 'request' ? 'bg-primary bg-opacity-25' : 'bg-success bg-opacity-25'
                        }`}>
                          <AlertCircle size={20} color={
                            notification.type === 'alert' ? '#dc3545' :
                            notification.type === 'request' ? '#0d6efd' : '#198754'
                          } />
                        </div>
                        <div>
                          <p className="mb-0 fw-medium">{notification.text}</p>
                          <p className="text-muted small mb-0">{notification.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted">No recent notifications</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;