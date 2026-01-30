/**
 * Menu Page
 *
 * This page displays all available menu items with filtering by category.
 * Users can add items to their cart from this page.
 *
 * @module pages/Menu
 */

import React, { useEffect, useState, useRef } from 'react';
import { Plus, Check } from 'lucide-react';
import { menuService } from '../../services';
import { useCart } from '../../context';
import type { MenuItem } from '../../types';

/**
 * Menu Page Component
 */
const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  // FIX: Use a Map to track added state per item with timeout IDs for cleanup
  const [addedItems, setAddedItems] = useState<Map<string, boolean>>(new Map()); // Track which items are showing "Added"
  const timeoutRefs = useRef<Map<string, number>>(new Map()); // Store timeout IDs separately
  const { addItem, items: cartItems } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [items, cats] = await Promise.all([
          menuService.getAllMenuItems(),
          menuService.getCategories(),
        ]);
        setMenuItems(items);
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Filter items by category
   */
  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  /**
   * Handle add to cart - FIXED: Only shows "Added" on clicked item
   */
  const handleAddToCart = (item: MenuItem) => {
    addItem(item, 1);

    // Clear any existing timeout for this item
    const existingTimeout = timeoutRefs.current.get(item._id);
    if (existingTimeout) {
      window.clearTimeout(existingTimeout);
    }

    // Update the state to show "Added" for this specific item
    setAddedItems((prev) => new Map(prev).set(item._id, true));

    // Set new timeout to remove "Added" state
    const timeoutId = window.setTimeout(() => {
      setAddedItems((prev) => {
        const newMap = new Map(prev);
        newMap.delete(item._id);
        return newMap;
      });
      timeoutRefs.current.delete(item._id);
    }, 2000);

    // Store the timeout ID
    timeoutRefs.current.set(item._id, timeoutId);
  };

  /**
   * Get quantity of item in cart
   */
  const getItemQuantityInCart = (itemId: string): number => {
    const cartItem = cartItems.find((item) => item.menuItemId === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeoutRefs.current.clear(); // Clear the map reference
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h1>
        <p className="text-gray-600">Browse our delicious selection of dishes</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            selectedCategory === ''
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const quantityInCart = getItemQuantityInCart(item._id);
          const isJustAdded = addedItems.get(item._id) || false;

          return (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {!item.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Unavailable</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-lg font-bold text-blue-600">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{item.category}</span>

                  {quantityInCart > 0 && (
                    <span className="text-sm text-green-600 font-medium">
                      {quantityInCart} in cart
                    </span>
                  )}
                </div>

                {/* Add to Cart Button - FIXED: Only shows "Added" for clicked item */}
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.available}
                  className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    isJustAdded
                      ? 'bg-green-600 text-white'
                      : !item.available
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isJustAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No items found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
