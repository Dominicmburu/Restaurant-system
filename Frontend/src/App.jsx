import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { OrderProvider } from './contexts/OrderContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Menu from './components/ordering/Menu';
import BookingPage from './components/booking/BookingPage';
import Dashboard from './components/dashboard/Dashboard';

import About from './pages/About';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';

import RestaurantProfile from './components/dashboard/RestaurantProfile';
import OrderPage from './components/ordering/OrderPage';

import Checkout from './components/ordering/Checkout';
import OrderConfirmation from './components/ordering/OrderConfirmation';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Cart from './components/ordering/Cart';
import Profile from './pages/Profile';
import RestaurantProf from './components/dashboard/RestaurantProf';
import OrdersList from './components/dashboard/OrdersList';
import RestaurantsList from './components/dashboard/RestaurantsList';
import MenuEditor from './components/dashboard/MenuEditor';
import BookingsList from './components/dashboard/BookingsList';
import DeliveryManagement from './components/dashboard/DeliveryManagement';
import UsersManagement from './components/dashboard/UsersManagement';
import AdminProfile from './components/dashboard/AdminProfile';
import AdminSettings from './components/dashboard/AdminSettings';
import AdminNotifications from './components/dashboard/AdminNotifications';
import AdminLayout from './components/layout/AdminLayout';
import PaymentSuccessPage from './components/ordering/PaymentSuccessPage';
import PaymentCancelPage from './components/ordering/PaymentCancelPage';
import TableManagement from './components/dashboard/TableManagement';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <OrderProvider>
          <Router>
            <main>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<AppLayout><Home /></AppLayout>} />
                <Route path="/menu" element={<AppLayout><Menu /></AppLayout>} />
                <Route path="/booking" element={<AppLayout><BookingPage /></AppLayout>} />
                <Route path="/order" element={<AppLayout><OrderPage /></AppLayout>} />
                <Route path="/cart" element={<AppLayout><Cart /></AppLayout>} />
                <Route path="/checkout" element={<AppLayout><Checkout /></AppLayout>} />
                <Route path="/order-confirmation" element={<AppLayout><OrderConfirmation /></AppLayout>} />
                <Route path="/about" element={<AppLayout><About /></AppLayout>} />
                <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
                <Route path="/reviews" element={<AppLayout><Reviews /></AppLayout>} />
                <Route path="/restaurant/:id" element={<AppLayout><RestaurantProfile /></AppLayout>} />
                <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
                <Route path="/register" element={<AppLayout><Register /></AppLayout>} />
                <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/payment-cancel" element={<PaymentCancelPage />} />

                {/* Protected admin routes */}
                <Route path="/admin/dashboard" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/admin/restaurants" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <RestaurantProf />
                  </PrivateRoute>
                } />
                <Route path="/admin/restaurants/list" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <RestaurantsList />
                  </PrivateRoute>
                } />
                <Route path="/admin/menu" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <MenuEditor />
                  </PrivateRoute>
                } />
                <Route path="/admin/table" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <TableManagement />
                  </PrivateRoute>
                } />
                <Route path="/admin/orders" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <OrdersList />
                  </PrivateRoute>
                } />
                <Route path="/admin/bookings" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <BookingsList />
                  </PrivateRoute>
                } />
                <Route path="/admin/delivery" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <DeliveryManagement />
                  </PrivateRoute>
                } />
                <Route path="/admin/users" element={
                  <PrivateRoute allowedRoles={['ADMIN']}>
                    <UsersManagement />
                  </PrivateRoute>
                } />
                <Route path="/admin/profile" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <AdminProfile />
                  </PrivateRoute>
                } />
                <Route path="/admin/settings" element={
                  <PrivateRoute allowedRoles={['ADMIN']}>
                    <AdminSettings />
                  </PrivateRoute>
                } />
                <Route path="/admin/notifications" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <AdminNotifications />
                  </PrivateRoute>
                } />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </Router>
        </OrderProvider>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;