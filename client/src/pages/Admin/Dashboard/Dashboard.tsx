/**
 * Admin Dashboard Page
 * 
 * This page provides an overview for administrators with
 * statistics and quick access to admin functions.
 * 
 * @module pages/Admin/Dashboard
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, DollarSign, TrendingUp, ShoppingBag, Utensils } from 'lucide-react';
import { orderService } from '../../../services';
import type { Order } from '../../../types';

/**
 * Admin Dashboard Page Component
 */
const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        setOrders(data);
        
        // Calculate statistics
        const totalRevenue = data.reduce((sum, order) => sum + order.totalAmount, 0);
        const pendingOrders = data.filter(
          (o) => o.status === 'Order Received' || o.status === 'Preparing'
        ).length;
        const deliveredOrders = data.filter((o) => o.status === 'Delivered').length;
        
        setStats({
          totalOrders: data.length,
          totalRevenue,
          pendingOrders,
          deliveredOrders,
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get recent orders (last 5)
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Delivered</p>
              <p className="text-3xl font-bold text-gray-900">{stats.deliveredOrders}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/admin/orders"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <div className="bg-blue-100 p-4 rounded-lg">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Manage Orders</h3>
            <p className="text-gray-600">View and update order statuses</p>
          </div>
        </Link>

        <Link
          to="/admin/menu"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <div className="bg-green-100 p-4 rounded-lg">
            <Utensils className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Manage Menu</h3>
            <p className="text-gray-600">Add, edit, or remove menu items</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="divide-y">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-gray-600">No orders yet</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order._id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t">
          <Link
            to="/admin/orders"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Orders →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
