/**
 * Order Model
 * 
 * This module defines the Order schema and model for MongoDB.
 * It represents customer orders with items, delivery details, and status tracking.
 * 
 * @module models/Order
 */

import mongoose, { Schema, Document } from 'mongoose';
import type { OrderStatus, OrderItem, DeliveryDetails } from '../types';

/**
 * Interface representing an Order document in MongoDB
 * Extends mongoose Document for type safety
 */
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  deliveryDetails: DeliveryDetails;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: [true, 'Menu item ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be a whole number',
      },
    },
  },
  { _id: false }
);

const DeliveryDetailsSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Delivery name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    address: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
      minlength: [10, 'Address must be at least 10 characters long'],
      maxlength: [200, 'Address cannot exceed 200 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[\d\s\-\+\(\)]{10,20}$/,
        'Please enter a valid phone number',
      ],
    },
  },
  { _id: false }
);

const OrderSchema: Schema<IOrder> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    items: {
      type: [OrderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: function (items: OrderItem[]) {
          return items.length > 0;
        },
        message: 'Order must contain at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
      validate: {
        validator: function(value: number) {
          return value > 0;
        },
        message: 'Total amount is required'
      }
    },
    deliveryDetails: {
      type: DeliveryDetailsSchema,
      required: [true, 'Delivery details are required'],
    },
    status: {
      type: String,
      enum: {
        values: ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
        message: 'Status must be one of: Order Received, Preparing, Out for Delivery, Delivered, Cancelled',
      },
      default: 'Order Received',
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ userId: 1, createdAt: -1 });

OrderSchema.pre('save', function () {
  this.totalAmount = this.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  this.totalAmount = Math.round(this.totalAmount * 100) / 100;
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
