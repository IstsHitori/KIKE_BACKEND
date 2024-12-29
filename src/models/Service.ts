import mongoose, { Schema } from "mongoose";

export interface IService {
  name: string;
  price: number;
}

export const ServiceSchema: Schema = new Schema<IService>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
export const ServiceModel = mongoose.model<IService>("Service", ServiceSchema);
