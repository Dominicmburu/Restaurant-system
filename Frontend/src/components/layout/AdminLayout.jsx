import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, Users, ShoppingBag, 
  Calendar, Settings, HelpCircle, LogOut,
  Bell, Search, User, ChevronDown,
  Table2Icon
} from 'lucide-react';
import { Car } from 'lucide-react';
import { MenuIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userData, setUserData] = useState({ name: 'Admin User' });
  const [loading, setLoading] = useState(true);
  
  const location = useLocation ? useLocation() : { pathname: window.location.pathname };
  const navigate = useNavigate ? useNavigate() : null;
  const currentPath = location.pathname;
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect to login if no token
          if (navigate) {
            navigate('/login');
          } else {
            window.location.href = '/login';
          }
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Handle unauthorized access
        if (error.response && error.response.status === 401) {
          if (navigate) {
            navigate('/login');
          } else {
            window.location.href = '/login';
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Call logout API
      await axios.get('http://localhost:5000/api/auth/logout', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      
      // Redirect to login page
      if (navigate) {
        navigate('/login');
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Force logout on client side even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      
      if (navigate) {
        navigate('/login');
      } else {
        window.location.href = '/login';
      }
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsOpen && !event.target.closest('.notifications-container')) {
        setNotificationsOpen(false);
      }
      
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    
    const handleSidebarClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 768 && 
          !event.target.closest('.sidebar') && 
          !event.target.closest('.sidebar-toggle')) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleSidebarClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleSidebarClickOutside);
    };
  }, [notificationsOpen, userMenuOpen, sidebarOpen]);

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
    // { icon: Users, label: 'Restaurants', href: '/admin/restaurants' },
    { icon: Users, label: 'Restaurants', href: '/admin/restaurants/list' },
    { icon: MenuIcon, label: 'Menu', href: '/admin/menu' },
    { icon: Table2Icon, label: 'Table', href: '/admin/table' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
    { icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
    // { icon: Car, label: 'Delivery', href: '/admin/delivery' },
    { icon: User, label: 'Users', href: '/admin/users' },
    // { icon: HelpCircle, label: 'Support', href: '/admin/support' },
  ];

  // Sample notifications
  const notifications = [
    { id: 1, text: 'New restaurant approval request', time: '5 minutes ago' },
    { id: 2, text: 'Order #1089 has been cancelled', time: '22 minutes ago' },
    { id: 3, text: 'Booking conflict detected', time: '1 hour ago' },
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userData.name) {
      const nameParts = userData.name.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
      }
      return userData.name.charAt(0);
    }
    return 'U';
  };

  return (
    <div className="d-flex vh-100">
      {/* Mobile overlay for sidebar */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" 
          style={{ zIndex: 1029 }}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`
        sidebar position-fixed h-100 start-0 top-0 bg-white shadow transition-all
        ${sidebarOpen ? 'translate-start-0' : 'translate-start-100'}
      `} style={{ 
        width: '250px',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s',
        zIndex: 1030
      }}>
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <div className="d-flex align-items-center">
            <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
              <span className="text-white fw-bold">T</span>
            </div>
            <h1 className="ms-2 fs-5 fw-bold mb-0">TurkNuzz</h1>
          </div>
          <button onClick={toggleSidebar} className="btn btn-sm border-0 d-md-none">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-auto h-100" style={{ paddingBottom: '60px' }}>
          <nav className="mt-3 px-2">
            <ul className="nav flex-column">
              {navItems.map((item, index) => {
                // Check if current path matches this nav item
                const isActive = currentPath === item.href || 
                                (item.href !== '/admin/dashboard' && currentPath.startsWith(item.href));
                
                return (
                  <li key={index} className="nav-item mb-1">
                    <a 
                      href={item.href}
                      className={`
                        nav-link d-flex align-items-center px-3 py-2 rounded
                        ${isActive ? 
                          'bg-warning bg-opacity-10 text-warning' : 
                          'text-secondary'
                        }
                      `}
                      onClick={(e) => {
                        if (window.innerWidth < 768) {
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      <item.icon size={20} className="me-2" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <div className="position-absolute bottom-0 w-100 border-top p-3 bg-white">
          <button 
            onClick={handleLogout}
            className="d-flex align-items-center px-3 py-2 text-secondary text-decoration-none rounded border-0 bg-transparent w-100 text-start"
          >
            <LogOut size={20} className="me-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden w-100" style={{ 
        marginLeft: sidebarOpen && window.innerWidth >= 768 ? '250px' : '0', 
        transition: 'margin-left 0.3s' 
      }}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky-top">
          <div className="d-flex align-items-center justify-content-between p-3">
            <div className="d-flex align-items-center">
              <button 
                onClick={toggleSidebar} 
                className="btn btn-sm border-0 me-3 sidebar-toggle"
                aria-label="Toggle sidebar"
              >
                <Menu size={24} />
              </button>
              <h2 className="fs-4 fw-semibold mb-0">{title}</h2>
            </div>
            <div className="d-flex align-items-center">
              {/* Search */}
              <div className="position-relative me-3 d-none d-md-block">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="form-control form-control-sm ps-4"
                  style={{ width: '200px' }}
                />
                <div className="position-absolute start-0 top-50 translate-middle-y ms-2">
                  <Search size={16} className="text-muted" />
                </div>
              </div>
              
              {/* Notifications */}
              <div className="position-relative me-3 notifications-container">
                <button 
                  className="btn btn-sm position-relative border-0"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    if (userMenuOpen) setUserMenuOpen(false);
                  }}
                  aria-label="Notifications"
                >
                  <Bell size={22} />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    3
                  </span>
                </button>
                
                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="position-absolute end-0 mt-2 dropdown-menu show p-0" style={{ 
                    width: '320px', 
                    zIndex: 1035,
                    maxWidth: 'calc(100vw - 30px)'
                  }}>
                    <div className="p-3 border-bottom">
                      <h6 className="fw-semibold mb-0">Notifications</h6>
                    </div>
                    <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                      {notifications.map(notification => (
                        <div key={notification.id} className="p-3 border-bottom dropdown-item text-wrap">
                          <p className="fw-medium mb-1 small">{notification.text}</p>
                          <p className="text-muted mb-0 small">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 text-center border-top">
                      <a href="/admin/notifications" className="small text-warning text-decoration-none">
                        View all notifications
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Menu */}
              <div className="position-relative user-menu-container">
                <button 
                  className="btn btn-sm border-0 d-flex align-items-center"
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    if (notificationsOpen) setNotificationsOpen(false);
                  }}
                  aria-label="User menu"
                >
                  <div className="bg-secondary bg-opacity-25 rounded-circle overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <span className="text-secondary fw-semibold">{getUserInitials()}</span>
                    )}
                  </div>
                  <span className="d-none d-md-block ms-2">{loading ? 'Loading...' : userData.name}</span>
                  <ChevronDown size={16} className="ms-1" />
                </button>
                
                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="position-absolute end-0 mt-2 dropdown-menu show" style={{ 
                    width: '200px', 
                    zIndex: 1035,
                    maxWidth: 'calc(100vw - 30px)'
                  }}>
                    <a href="/admin/profile" className="dropdown-item">
                      Your Profile
                    </a>
                    <a href="/admin/settings" className="dropdown-item">
                      Settings
                    </a>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item">
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-grow-1 overflow-auto bg-light">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;