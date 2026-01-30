/**
 * Cart Page
 *
 * This page displays the user's shopping cart with items,
 * quantities, and total. Users can modify quantities or proceed to checkout.
 *
 * @module pages/Cart
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart, useAuth } from '../../context';

/**
 * Cart Page Component
 */
const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  /**
   * Handle quantity increase
   */
  const handleIncrease = (menuItemId: string, currentQuantity: number) => {
    updateQuantity(menuItemId, currentQuantity + 1);
  };

  /**
   * Handle quantity decrease
   */
  const handleDecrease = (menuItemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(menuItemId, currentQuantity - 1);
    }
  };

  /**
   * Handle remove item
   */
  const handleRemove = (menuItemId: string) => {
    removeItem(menuItemId);
  };

  /**
   * Handle proceed to checkout
   * FIXED: Properly redirects to login if not authenticated, then returns to checkout
   */
  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Store checkout as the intended destination after login
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items yet.</p>
          <Link
            to="/menu"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Menu
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items - FIXED: Properly displays all items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.menuItemId}
              className="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
            >
              {/* Item Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              {/* Item Details */}
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)} each</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDecrease(item.menuItemId, item.quantity)}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item.menuItemId, item.quantity)}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right min-w-[80px]">
                <p className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(item.menuItemId)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {/* Clear Cart Button */}
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

          {/* FIXED: Show all items in summary */}
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item.menuItemId} className="flex justify-between text-sm text-gray-600">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>{isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <Link
            to="/menu"
            className="block text-center mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
