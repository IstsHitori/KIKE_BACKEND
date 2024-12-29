import { Document, Schema, Types } from "mongoose";

export interface IProducts_item extends Document {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export const ProducstItemSchema: Schema = new Schema({
  product: {
    type: Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
