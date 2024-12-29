import mongoose, { Document, Schema, Types } from "mongoose";

export interface IDebtor extends Document {
  client: Types.ObjectId;
  order: Types.ObjectId;
  totalDebt: number;
  status: boolean;
  createdAt: Date;
}

const DebtorSchema = new Schema<IDebtor>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    order:{
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    totalDebt: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: function () {
        return new Date();
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Debtor = mongoose.model<IDebtor>("Debtor", DebtorSchema);
