import { Request, Response } from "express";
import { Client } from "../models/Client";
import { Order } from "../models/Order";
import { IProducts_item } from "../models/Product_item";
import { IService } from "../models/Service";
import { Product } from "../models/Product";
import { Types } from "mongoose";
import { PRODUCT_ERRORS } from "../utils/errors";

interface DraftOrder {
  nitCustomer: number;
  nameCustomer: string;
  products: IProducts_item[];
  services: IService[];
  total_amount: Number;
  payment_method: String;
  date: Date;
}

export class OrderController {
  static createOrder = async (req: Request, res: Response) => {
    try {
      const {
        nitCustomer,
        products,
        services,
        total_amount,
        payment_method,
        date,
        nameCustomer,
      }: DraftOrder = req.body;

      // Buscar el cliente por su NIT
      const searchClient = await Client.findOne({ nit: nitCustomer });
      let clientId;

      if (!searchClient) {
        // Crear el cliente si no existe
        const newClient = new Client({ name: nameCustomer, nit: nitCustomer });
        await newClient.save();
        clientId = newClient._id; // Casteo explícito
      } else {
        clientId = searchClient._id;
      }

      // Actualizar el stock de los productos
      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
          res
            .status(404)
            .json({ msg:PRODUCT_ERRORS.PRODUCT_DOESNT_EXIST});
          return;
        }
        if (product.stock < item.quantity) {
          res.status(400).json({
            msg: `No se encontró stock para el producto ${product.name}. Disponible: ${product.stock}, Necesitado: ${item.quantity}.`,
          });
          return;
        }
        // Descontar el stock
        product.stock -= item.quantity;
        await product.save();
      }

      // Crear la orden
      const order = new Order({
        client: clientId,
        products: products ? products : [],
        services: services ? services : [],
        total_amount,
        payment_method,
        date,
      });

      await order.save();

      res.json({ message: "Order created successfully." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while creating the order." });
    }
  };

  static getAllOrders = async (req: Request, res: Response) => {
    try {
      const arrayOrders = await Order.find().populate({
        path: "products.product",
        select: "name",
      });

      res.json({
        orders: arrayOrders,
      });
    } catch (error) {
      console.log(error);
    }
  };
}
