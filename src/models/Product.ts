import mongoose, { Schema, Types } from "mongoose";
import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  stock: number;
  category: Types.ObjectId;
  weight: string;
  brand: string;
  price: number;
  code: string;
  description: string;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
    },
    weight: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      default: "No aplica",
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
