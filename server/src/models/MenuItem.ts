/**
 * MenuItem Model
 * 
 * This module defines the MenuItem schema and model for MongoDB.
 * It represents food items available in the restaurant menu.
 * 
 * @module models/MenuItem
 */

import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing a MenuItem document in MongoDB
 * Extends mongoose Document for type safety
 */
export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema: Schema<IMenuItem> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      validate: {
        validator: function (value: number) {
          return value >= 0 && /^(\d{1,8}(\.\d{1,2})?)$/.test(value.toString());
        },
        message: 'Price must be a valid amount with up to 2 decimal places',
      },
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['Pizza', 'Burgers', 'Pasta', 'Sides', 'Desserts', 'Drinks', 'Other'],
        message: 'Category must be one of: Pizza, Burgers, Pasta, Sides, Desserts, Drinks, Other',
      },
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ available: 1 });
MenuItemSchema.index({ name: 'text', description: 'text' });

const MenuItem = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

export default MenuItem;
