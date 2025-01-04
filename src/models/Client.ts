import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  nit: number;
  telephone: string;
  isDebtor: boolean;
  date: Date;

}

const ClientSchema = new Schema<IClient>({
  name: {
    type: String,
    required: true,
  },
  nit: {
    type: Number,
    required: true,
  },
  telephone: {
    type: String,
    default: "No aplica",
  },
  isDebtor: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: function () {
      return new Date();
    },
  },
});

export const Client = mongoose.model<IClient>("Client", ClientSchema);
