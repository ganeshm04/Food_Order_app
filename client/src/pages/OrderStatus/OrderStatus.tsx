/**
 * Order Status Page
 * 
 * This page displays the current status of an order with a refresh button
 * and automatic refresh when the user returns to the page.
 * 
 * @module pages/OrderStatus
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, Package, ChefHat, Truck, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { orderService } from '../../services';
import type { Order, OrderStatus } from '../../types';

/**
 * Order status configuration with icons and colors
 */
const statusConfig: Record<OrderStatus, { icon: React.ReactNode; color: string; label: string }> = {
  'Order Received': {
    icon: <Package className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-600',
    label: 'Order Received',
  },
  'Preparing': {
    icon: <ChefHat className="w-6 h-6" />,
    color: 'bg-yellow-100 text-yellow-600',
    label: 'Preparing',
  },
  'Out for Delivery': {
    icon: <Truck className="w-6 h-6" />,
    color: 'bg-orange-100 text-orange-600',
    label: 'Out for Delivery',
  },
  'Delivered': {
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'bg-green-100 text-green-600',
    label: 'Delivered',
  },
  'Cancelled': {
    icon: <XCircle className="w-6 h-6" />,
    color: 'bg-red-100 text-red-600',
    label: 'Cancelled',
  },
};

/**
 * Order status steps for progress indicator
 */
const statusSteps: OrderStatus[] = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

/**
 * Order Status Page Component
 */
const OrderStatusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState('');

  /**
   * Fetch order status
   */
  const fetchOrderStatus = useCallback(async (showLoading = false) => {
    if (!id) return;
    
    if (showLoading) {
      setIsRefreshing(true);
    }
    
    try {
      const data = await orderService.getOrderById(id);
      setOrder(data);
      setLastUpdated(new Date());
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to fetch order status');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [id]);

  /**
   * Initial fetch
   */
  useEffect(() => {
    fetchOrderStatus();
  }, [fetchOrderStatus]);

  /**
   * Refresh on page visibility change (when user returns to tab)
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchOrderStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh on window focus
    window.addEventListener('focus', () => fetchOrderStatus());

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', () => fetchOrderStatus());
    };
  }, [fetchOrderStatus]);

  /**
   * Handle manual refresh
   */
  const handleRefresh = () => {
    fetchOrderStatus(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = order.status;
  const currentStepIndex = statusSteps.indexOf(currentStatus);
  const statusInfo = statusConfig[currentStatus];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to Orders
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-6)}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            {/* Last Updated */}
            {lastUpdated && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Current Status */}
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${statusInfo.color}`}>
          {statusInfo.icon}
          <span className="font-semibold">{statusInfo.label}</span>
        </div>
      </div>

      {/* Progress Steps */}
      {currentStatus !== 'Cancelled' && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded transition-all duration-500"
              style={{
                width: currentStepIndex >= 0 ? `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` : '0%',
              }}
            ></div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : isCurrent
                          ? 'bg-white border-blue-600 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Details</h2>
        
        {/* Items */}
        <div className="space-y-3 mb-6">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-blue-600">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
        <div className="space-y-2">
          <p><span className="text-gray-600">Name:</span> {order.deliveryDetails.name}</p>
          <p><span className="text-gray-600">Address:</span> {order.deliveryDetails.address}</p>
          <p><span className="text-gray-600">Phone:</span> {order.deliveryDetails.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
