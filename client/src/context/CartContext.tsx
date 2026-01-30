/**
 * Cart Context
 * 
 * This module provides React context for shopping cart state management.
 * Includes cart items, add/remove functions, and localStorage persistence.
 * 
 * @module context/CartContext
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, MenuItem } from '../types';

/**
 * Cart context state interface
 */
interface CartContextState {
  /** Array of items in cart */
  items: CartItem[];
  /** Total number of items in cart */
  itemCount: number;
  /** Total price of all items in cart */
  totalAmount: number;
  /** Add item to cart */
  addItem: (item: MenuItem, quantity?: number) => void;
  /** Remove item from cart */
  removeItem: (menuItemId: string) => void;
  /** Update item quantity */
  updateQuantity: (menuItemId: string, quantity: number) => void;
  /** Clear entire cart */
  clearCart: () => void;
}

/**
 * Create cart context with default values
 */
const CartContext = createContext<CartContextState | undefined>(undefined);

/**
 * Cart provider props
 */
interface CartProviderProps {
  children: React.ReactNode;
}

/**
 * Local storage key for cart persistence
 */
const CART_STORAGE_KEY = 'food-delivery-cart';

/**
 * Cart Provider Component
 * Wraps the application to provide cart context
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // State
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Load cart from localStorage on mount
   */
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  /**
   * Save cart to localStorage whenever it changes
   */
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  /**
   * Add item to cart
   * @param item - Menu item to add
   * @param quantity - Quantity to add (default: 1)
   */
  const addItem = useCallback((item: MenuItem, quantity: number = 1): void => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.menuItemId === item._id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return currentItems.map((i) =>
          i.menuItemId === item._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      
      // Add new item
      return [
        ...currentItems,
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity,
          image: item.image,
        },
      ];
    });
  }, []);

  /**
   * Remove item from cart
   * @param menuItemId - ID of item to remove
   */
  const removeItem = useCallback((menuItemId: string): void => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.menuItemId !== menuItemId)
    );
  }, []);

  /**
   * Update item quantity
   * @param menuItemId - ID of item to update
   * @param quantity - New quantity (if 0, item is removed)
   */
  const updateQuantity = useCallback((menuItemId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback((): void => {
    setItems([]);
  }, []);

  // Derived state
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Context value
  const value: CartContextState = {
    items,
    itemCount,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook to use cart context
 * Must be used within CartProvider
 * 
 * @returns Cart context state
 * @throws Error if used outside CartProvider
 */
export const useCart = (): CartContextState => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
