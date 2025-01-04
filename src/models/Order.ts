import mongoose, { Document, Schema, Types } from "mongoose";
import { IProducts_item, ProducstItemSchema } from "./Product_item";
import { IService, ServiceSchema } from "./Service";
import { Client } from "./Client";

export interface IOrder extends Document {
  client: Types.ObjectId;
  products: IProducts_item[];
  services: IService[];
  total_amount: number;
  payment_status: "pendiente" | "parcial" | "pago";
  pending_amount: number;
  paid_amount: number;
  payment_history: {
    amount: number;
    payment_method: string;
    date: Date;
  }[];
  date: Date;
}

const OrderSchema: Schema = new Schema<IOrder>({
  client: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Client",
  },
  products: [ProducstItemSchema],
  services: [ServiceSchema],
  total_amount: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ["pendiente", "parcial", "pago"],
    default: "pendiente",
  },
  pending_amount: {
    type: Number,
    required: true,
    default: 0,
  },
  paid_amount: {
    type: Number,
    default: 0,
  },
  payment_history: [
    {
      amount: Number,
      payment_method: String,
      date: {
        type: Date,
        default: function () {
          return new Date();
        },
      },
    },
  ],
  date: {
    type: Date,
    default: function () {
      return new Date();
    },
  },
});

// Middleware para actualizar el estado de pago
OrderSchema.pre<IOrder>("save", async function (next) {
  if (this.paid_amount >= this.total_amount) {
    this.payment_status = "pago";
    this.pending_amount = 0;
    //Buscar el cliente y cambiar su estado de deudor a false
    const searchClient = await Client.findById(this.client);
    if (!searchClient) return next();
    //---
    searchClient.isDebtor = false;
    await searchClient.save();
  } else if (this.paid_amount > 0) {
    this.payment_status = "parcial";
    this.pending_amount = this.total_amount - this.paid_amount;
  } else {
    this.payment_status = "pendiente";
    this.pending_amount = this.total_amount;
    const searchClient = await Client.findById(this.client);
    if (searchClient) {
      searchClient.isDebtor = true;
      await searchClient.save();
    }
  }
  next();
});

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
