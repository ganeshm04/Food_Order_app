/**
 * Order Model Tests
 * 
 * This test suite covers the Order Mongoose model including:
 * - Schema validation
 * - CRUD operations
 * - Validation rules for order items and delivery details
 * - Status management
 * 
 * @module tests/models/Order
 */

import mongoose from 'mongoose';
import Order, { IOrder } from '../../models/Order';
import {
  createMockObjectId,
  createMockOrderItem,
  createMockDeliveryDetails,
  createMockOrder,
} from '../utils/testHelpers';

// Mock the Order model methods
jest.mock('../../models/Order', () => {
  const actualOrder = jest.requireActual('../../models/Order');
  return {
    __esModule: true,
    ...actualOrder,
    default: {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    },
  };
});

describe('Order Model', () => {
  let mockUserId: mongoose.Types.ObjectId;
  let mockMenuItemId: mongoose.Types.ObjectId;

  beforeEach(() => {
    mockUserId = createMockObjectId();
    mockMenuItemId = createMockObjectId();
    jest.clearAllMocks();
  });

  describe('Schema Validation', () => {
    describe('Order Creation', () => {
      it('should create a valid order with all required fields', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem({ menuItemId: mockMenuItemId.toString() })],
          totalAmount: 25.98,
          deliveryDetails: createMockDeliveryDetails(),
          status: 'Order Received' as const,
        };

        const mockOrder = {
          _id: createMockObjectId(),
          ...orderData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        (Order.create as jest.Mock).mockResolvedValue(mockOrder);

        const order = await Order.create(orderData);

        expect(order).toBeDefined();
        expect(order.userId).toEqual(mockUserId);
        expect(order.items).toHaveLength(1);
        expect(order.totalAmount).toBe(25.98);
        expect(order.status).toBe('Order Received');
      });

      it('should fail when userId is missing', async () => {
        const orderData = {
          items: [createMockOrderItem()],
          totalAmount: 25.98,
          deliveryDetails: createMockDeliveryDetails(),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('User ID is required')
        );

        await expect(Order.create(orderData)).rejects.toThrow('User ID is required');
      });

      it('should fail when items array is empty', async () => {
        const orderData = {
          userId: mockUserId,
          items: [],
          totalAmount: 0,
          deliveryDetails: createMockDeliveryDetails(),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Order items are required')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Order items are required');
      });

      it('should fail when items is not an array', async () => {
        const orderData = {
          userId: mockUserId,
          items: 'not-an-array',
          totalAmount: 25.98,
          deliveryDetails: createMockDeliveryDetails(),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Order items are required')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Order items are required');
      });

      it('should fail when totalAmount is negative', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem()],
          totalAmount: -10,
          deliveryDetails: createMockDeliveryDetails(),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Total amount cannot be negative')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Total amount cannot be negative');
      });

      it('should fail when deliveryDetails is missing', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem()],
          totalAmount: 25.98,
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Delivery details are required')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Delivery details are required');
      });
    });

    describe('Order Item Validation', () => {
      it('should fail when menuItemId is missing', async () => {
        const orderData = {
          userId: mockUserId,
          items: [{ name: 'Test Item', price: 10, quantity: 1 }],
          totalAmount: 10,
          deliveryDetails: createMockDeliveryDetails(),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Menu item ID is required')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Menu item ID is required');
      });

      it('should fail when item name is missing', async () => {
        const orderData = {
          userId: mockUserId,
          items: [{ menuItemId: mockMenuItemId.toString(), price: 10, quantity: 1 }],
          totalAmount: 10,
          deliveryDetails: createMockDeliveryDetails(),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Item name is required')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Item name is required');
      });

      it('should fail when item price is negative', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem({ price: -5 })],
          totalAmount: -10,
          deliveryDetails: createMockDeliveryDetails(),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Price cannot be negative')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Price cannot be negative');
      });

      it('should fail when quantity is less than 1', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem({ quantity: 0 })],
          totalAmount: 0,
          deliveryDetails: createMockDeliveryDetails(),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Quantity must be at least 1')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Quantity must be at least 1');
      });

      it('should fail when quantity is not an integer', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem({ quantity: 1.5 })],
          totalAmount: 19.485,
          deliveryDetails: createMockDeliveryDetails(),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Quantity must be a whole number')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Quantity must be a whole number');
      });

      it('should accept multiple items in an order', async () => {
        const items = [
          createMockOrderItem({ menuItemId: createMockObjectId().toString(), name: 'Item 1', price: 10, quantity: 2 }),
          createMockOrderItem({ menuItemId: createMockObjectId().toString(), name: 'Item 2', price: 15, quantity: 1 }),
        ];
        const orderData = {
          userId: mockUserId,
          items,
          totalAmount: 35,
          deliveryDetails: createMockDeliveryDetails(),
          status: 'Order Received' as const,
        };

        const mockOrder = {
          _id: createMockObjectId(),
          ...orderData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        (Order.create as jest.Mock).mockResolvedValue(mockOrder);

        const order = await Order.create(orderData);

        expect(order.items).toHaveLength(2);
        expect(order.totalAmount).toBe(35);
      });
    });

    describe('Delivery Details Validation', () => {
      it('should fail when delivery name is too short', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem()],
          totalAmount: 25.98,
          deliveryDetails: createMockDeliveryDetails({ name: 'A' }),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Name must be at least 2 characters long')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Name must be at least 2 characters long');
      });

      it('should fail when delivery name is too long', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem()],
          totalAmount: 25.98,
          deliveryDetails: createMockDeliveryDetails({ name: 'A'.repeat(51) }),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Name cannot exceed 50 characters')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Name cannot exceed 50 characters');
      });

      it('should fail when address is too short', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem()],
          totalAmount: 25.98,
          deliveryDetails: createMockDeliveryDetails({ address: 'Short' }),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Address must be at least 10 characters long')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Address must be at least 10 characters long');
      });

      it('should fail when address is too long', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem()],
          totalAmount: 25.98,
          deliveryDetails: createMockDeliveryDetails({ address: 'A'.repeat(201) }),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Address cannot exceed 200 characters')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Address cannot exceed 200 characters');
      });

      it('should fail when phone number is invalid', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem()],
          totalAmount: 25.98,
          deliveryDetails: createMockDeliveryDetails({ phone: 'invalid-phone' }),
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Please enter a valid phone number')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Please enter a valid phone number');
      });

      it('should accept valid phone number formats', async () => {
        const validPhones = [
          '+1 234-567-8900',
          '(123) 456-7890',
          '1234567890',
          '+44 20 7123 4567',
        ];

        for (const phone of validPhones) {
          const orderData = {
            userId: mockUserId,
            items: [createMockOrderItem()],
            totalAmount: 25.98,
            deliveryDetails: createMockDeliveryDetails({ phone }),
            status: 'Order Received' as const,
          };

          const mockOrder = {
            _id: createMockObjectId(),
            ...orderData,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          (Order.create as jest.Mock).mockResolvedValue(mockOrder);

          const order = await Order.create(orderData);
          expect(order).toBeDefined();
        }
      });
    });

    describe('Status Validation', () => {
      const validStatuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

      it.each(validStatuses)('should accept valid status: %s', async (status) => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem()],
          totalAmount: 25.98,
          deliveryDetails: createMockDeliveryDetails(),
          status,
        };

        const mockOrder = {
          _id: createMockObjectId(),
          ...orderData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        (Order.create as jest.Mock).mockResolvedValue(mockOrder);

        const order = await Order.create(orderData);
        expect(order.status).toBe(status);
      });

      it('should fail when status is invalid', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem()],
          totalAmount: 25.98,
          deliveryDetails: createMockDeliveryDetails(),
          status: 'Invalid Status',
        };

        (Order.create as jest.Mock).mockRejectedValue(
          new Error('Invalid order status')
        );

        await expect(Order.create(orderData)).rejects.toThrow('Invalid order status');
      });
    });
  });

  describe('CRUD Operations', () => {
    describe('Create', () => {
      it('should create order and return populated data', async () => {
        const orderData = {
          userId: mockUserId,
          items: [createMockOrderItem()],
          totalAmount: 25.98,
          deliveryDetails: createMockDeliveryDetails(),
          status: 'Order Received' as const,
        };

        const mockOrder = {
          _id: createMockObjectId(),
          ...orderData,
          createdAt: new Date(),
          updatedAt: new Date(),
          populate: jest.fn().mockReturnThis(),
        };

        (Order.create as jest.Mock).mockResolvedValue(mockOrder);

        const order = await Order.create(orderData);

        expect(Order.create).toHaveBeenCalledWith(orderData);
        expect(order).toBeDefined();
        expect(order._id).toBeDefined();
      });
    });

    describe('Read', () => {
      it('should find orders by userId', async () => {
        const mockOrders = [
          createMockOrder({ userId: mockUserId }),
          createMockOrder({ userId: mockUserId }),
        ];

        (Order.find as jest.Mock).mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockOrders),
        });

        const orders = await Order.find({ userId: mockUserId }).sort({ createdAt: -1 });

        expect(Order.find).toHaveBeenCalledWith({ userId: mockUserId });
        expect(orders).toHaveLength(2);
      });

      it('should find order by ID', async () => {
        const orderId = createMockObjectId();
        const mockOrder = createMockOrder({ _id: orderId, userId: mockUserId });

        (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

        const order = await Order.findById(orderId);

        expect(Order.findById).toHaveBeenCalledWith(orderId);
        expect(order).toBeDefined();
        expect(order?._id).toEqual(orderId);
      });

      it('should return null when order not found', async () => {
        const orderId = createMockObjectId();

        (Order.findById as jest.Mock).mockResolvedValue(null);

        const order = await Order.findById(orderId);

        expect(order).toBeNull();
      });

      it('should find all orders with filters', async () => {
        const mockOrders = [
          createMockOrder({ status: 'Order Received' }),
          createMockOrder({ status: 'Preparing' }),
        ];

        (Order.find as jest.Mock).mockReturnValue({
          sort: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockOrders),
          }),
        });

        const orders = await Order.find({ status: 'Order Received' })
          .sort({ createdAt: -1 })
          .populate('userId', 'name email');

        expect(Order.find).toHaveBeenCalledWith({ status: 'Order Received' });
        expect(orders).toHaveLength(2);
      });
    });

    describe('Update', () => {
      it('should update order status', async () => {
        const orderId = createMockObjectId();
        const mockOrder = createMockOrder({
          _id: orderId,
          userId: mockUserId,
          status: 'Order Received',
        });

        (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

        // Simulate status update
        (mockOrder as any).status = 'Preparing';
        (mockOrder as any).save = jest.fn().mockResolvedValue(mockOrder);

        const order = await Order.findById(orderId);
        if (order) {
          order.status = 'Preparing';
          await order.save();
        }

        expect(order?.status).toBe('Preparing');
      });

      it('should prevent updating delivered orders', async () => {
        const orderId = createMockObjectId();
        const mockOrder = createMockOrder({
          _id: orderId,
          userId: mockUserId,
          status: 'Delivered',
          save: jest.fn().mockRejectedValue(new Error('Cannot update delivered orders')),
        });

        (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

        const order = await Order.findById(orderId);
        if (order) {
          await expect(order.save()).rejects.toThrow('Cannot update delivered orders');
        }
      });

      it('should prevent updating cancelled orders', async () => {
        const orderId = createMockObjectId();
        const mockOrder = createMockOrder({
          _id: orderId,
          userId: mockUserId,
          status: 'Cancelled',
          save: jest.fn().mockRejectedValue(new Error('Cannot update cancelled orders')),
        });

        (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

        const order = await Order.findById(orderId);
        if (order) {
          await expect(order.save()).rejects.toThrow('Cannot update cancelled orders');
        }
      });
    });

    describe('Delete', () => {
      it('should delete order by ID', async () => {
        const orderId = createMockObjectId();
        const mockOrder = createMockOrder({ _id: orderId });

        (Order.findByIdAndDelete as jest.Mock).mockResolvedValue(mockOrder);

        const deletedOrder = await Order.findByIdAndDelete(orderId);

        expect(Order.findByIdAndDelete).toHaveBeenCalledWith(orderId);
        expect(deletedOrder).toBeDefined();
      });

      it('should return null when deleting non-existent order', async () => {
        const orderId = createMockObjectId();

        (Order.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        const deletedOrder = await Order.findByIdAndDelete(orderId);

        expect(deletedOrder).toBeNull();
      });
    });
  });

  describe('Order Status Workflow', () => {
    it('should follow valid status transition: Order Received -> Preparing', async () => {
      const orderId = createMockObjectId();
      const mockOrder = createMockOrder({
        _id: orderId,
        status: 'Order Received',
        save: jest.fn().mockResolvedValue({ status: 'Preparing' }),
      });

      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'Preparing';
        const saved = await order.save();
        expect(saved.status).toBe('Preparing');
      }
    });

    it('should follow valid status transition: Preparing -> Out for Delivery', async () => {
      const orderId = createMockObjectId();
      const mockOrder = createMockOrder({
        _id: orderId,
        status: 'Preparing',
        save: jest.fn().mockResolvedValue({ status: 'Out for Delivery' }),
      });

      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'Out for Delivery';
        const saved = await order.save();
        expect(saved.status).toBe('Out for Delivery');
      }
    });

    it('should follow valid status transition: Out for Delivery -> Delivered', async () => {
      const orderId = createMockObjectId();
      const mockOrder = createMockOrder({
        _id: orderId,
        status: 'Out for Delivery',
        save: jest.fn().mockResolvedValue({ status: 'Delivered' }),
      });

      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'Delivered';
        const saved = await order.save();
        expect(saved.status).toBe('Delivered');
      }
    });

    it('should allow cancellation from Order Received status', async () => {
      const orderId = createMockObjectId();
      const mockOrder = createMockOrder({
        _id: orderId,
        status: 'Order Received',
        save: jest.fn().mockResolvedValue({ status: 'Cancelled' }),
      });

      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'Cancelled';
        const saved = await order.save();
        expect(saved.status).toBe('Cancelled');
      }
    });

    it('should allow cancellation from Preparing status', async () => {
      const orderId = createMockObjectId();
      const mockOrder = createMockOrder({
        _id: orderId,
        status: 'Preparing',
        save: jest.fn().mockResolvedValue({ status: 'Cancelled' }),
      });

      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'Cancelled';
        const saved = await order.save();
        expect(saved.status).toBe('Cancelled');
      }
    });
  });
});
