/**
 * Seed Data Module
 * 
 * This module provides sample data for seeding the database.
 * Used for development and testing purposes.
 * 
 * @module utils/seedData
 */

import { CreateMenuItemRequest } from '../types';

/**
 * Sample menu items for seeding the database
 */
export const sampleMenuItems: CreateMenuItemRequest[] = [
  // Pizza
  {
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with tomato sauce, mozzarella cheese, and fresh basil. A timeless favorite that showcases the simplicity of Italian cuisine.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60',
    category: 'Pizza',
    available: true,
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Delicious pizza topped with spicy pepperoni slices, melted mozzarella, and our signature tomato sauce. Perfect for meat lovers.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60',
    category: 'Pizza',
    available: true,
  },
  {
    name: 'BBQ Chicken Pizza',
    description: 'Grilled chicken breast, red onions, cilantro, and BBQ sauce on a crispy crust. Topped with mozzarella and cheddar cheese.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
    category: 'Pizza',
    available: true,
  },
  // Burgers
  {
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheddar cheese, lettuce, tomato, pickles, and our special sauce on a toasted brioche bun.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    category: 'Burgers',
    available: true,
  },
  {
    name: 'Bacon Deluxe Burger',
    description: 'Beef patty topped with crispy bacon, American cheese, caramelized onions, and BBQ sauce. Served with fries.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=60',
    category: 'Burgers',
    available: true,
  },
  {
    name: 'Veggie Burger',
    description: 'Plant-based patty with avocado, sprouts, tomato, and vegan mayo on a whole wheat bun. A delicious meat-free option.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&auto=format&fit=crop&q=60',
    category: 'Burgers',
    available: true,
  },
  // Pasta
  {
    name: 'Spaghetti Carbonara',
    description: 'Traditional Italian pasta with creamy egg sauce, crispy pancetta, Parmesan cheese, and black pepper.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&auto=format&fit=crop&q=60',
    category: 'Pasta',
    available: true,
  },
  {
    name: 'Fettuccine Alfredo',
    description: 'Creamy Alfredo sauce with fettuccine pasta, topped with grilled chicken and fresh parsley.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd936714a?w=500&auto=format&fit=crop&q=60',
    category: 'Pasta',
    available: true,
  },
  // Sides
  {
    name: 'Garlic Bread',
    description: 'Crispy Italian bread topped with garlic butter, herbs, and melted mozzarella cheese.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=60',
    category: 'Sides',
    available: true,
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing, croutons, and shaved Parmesan cheese.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60',
    category: 'Sides',
    available: true,
  },
  {
    name: 'French Fries',
    description: 'Crispy golden fries seasoned with sea salt. Served with ketchup.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60',
    category: 'Sides',
    available: true,
  },
  // Drinks
  {
    name: 'Fresh Lemonade',
    description: 'Refreshing homemade lemonade with fresh lemons, pure cane sugar, and a hint of mint.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&auto=format&fit=crop&q=60',
    category: 'Drinks',
    available: true,
  },
  {
    name: 'Iced Coffee',
    description: 'Cold brewed coffee served over ice with your choice of milk and sweetener.',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?w=500&auto=format&fit=crop&q=60',
    category: 'Drinks',
    available: true,
  },
  {
    name: 'Chocolate Milkshake',
    description: 'Rich and creamy chocolate milkshake topped with whipped cream and chocolate syrup.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60',
    category: 'Drinks',
    available: true,
  },
  // Desserts
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&auto=format&fit=crop&q=60',
    category: 'Desserts',
    available: true,
  },
  {
    name: 'New York Cheesecake',
    description: 'Creamy cheesecake with a graham cracker crust, topped with strawberry sauce.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df26?w=500&auto=format&fit=crop&q=60',
    category: 'Desserts',
    available: true,
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60',
    category: 'Desserts',
    available: true,
  },
];
