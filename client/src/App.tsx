/**
 * Main App Component
 * 
 * This is the root component of the application.
 * Sets up routing and context providers.
 * 
 * @module App
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, CartProvider } from './context';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderStatus from './pages/OrderStatus/OrderStatus';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AdminDashboard from './pages/Admin/Dashboard/Dashboard';
import AdminOrders from './pages/Admin/Orders/Orders';
import AdminMenu from './pages/Admin/Menu/Menu';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

/**
 * Main App Component
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="cart" element={<Cart />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              
              {/* Protected User Routes */}
              <Route element={<ProtectedRoute requireAuth />}>
                <Route path="checkout" element={<Checkout />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="orders/:id" element={<OrderStatus />} />
              </Route>
              
              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute requireAuth requireAdmin />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/orders" element={<AdminOrders />} />
                <Route path="admin/menu" element={<AdminMenu />} />
              </Route>
              
              {/* 404 Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
