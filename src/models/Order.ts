import mongoose, { Document, Schema, Types } from "mongoose";
import { IProducts_item, ProducstItemSchema } from "./Product_item";
import { IService, ServiceSchema } from "./Service";

export interface IOrder extends Document {
  client: Types.ObjectId;
  products: IProducts_item[];
  services: IService[];
  total_amount: Number;
  payment_method: String;
  date: Date;
}

const OrderSchema: Schema = new Schema({
  client: {
    type: Types.ObjectId,
    required: true,
    ref: "Client",
  },
  products: [ProducstItemSchema],
  total_amount: {
    type: Number,
  },
  payment_method: {
    type: String,
    required: true,
  },
  services: [ServiceSchema],
  date: {
    type: Date,
    default: function () {
      return new Date();
    },
  },
});

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
