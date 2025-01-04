import { Types } from "mongoose";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { Client } from "../models/Client";

export const formattedDate = (date: string) =>
  new Date(date).toLocaleDateString("es-es", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formattedTime = (date: string) =>
  new Date(date).toLocaleTimeString("es-es", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
export const formatDate = (date: string) => {
  return `${formattedDate(date)} ${formattedTime(date)}`;
};

export async function getNameProductByID(id: Types.ObjectId): Promise<string> {
  const product = await Product.findById(id);
  return product?.name || "Producto no encontrado";
}

export async function clientHasDebts(
  clientId: Types.ObjectId
): Promise<boolean> {
  const orders = await Order.find({ client: clientId });

  return orders.some((order) => order.payment_status !== "pago");
}
export async function validateIfClientHasDebts(clientId: Types.ObjectId) {
  const searchClientAfterOrder = await Client.findById(clientId);

  if (!searchClientAfterOrder) return;
  const hasDebts = await clientHasDebts(clientId);
  if (hasDebts) {
    searchClientAfterOrder.isDebtor = true;
    await searchClientAfterOrder.save();
  }
}
