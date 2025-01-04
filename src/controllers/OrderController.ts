import { Request, Response } from "express";
import { Client } from "../models/Client";
import { Order } from "../models/Order";
import { IProducts_item } from "../models/Product_item";
import { IService } from "../models/Service";
import { Product } from "../models/Product";
import { ORDER_ERRORS, PRODUCT_ERRORS } from "../utils/errors";
import { createPrint, IDataOfSell } from "./PrintController";
import { validateIfClientHasDebts } from "../utils";

interface DraftOrder {
  nitCustomer: number;
  nameCustomer: string;
  products: IProducts_item[];
  services: IService[];
  total_amount: Number;
  payment_method: String;
  paid_amount: number;
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
        paid_amount,
      }: DraftOrder = req.body;

      // Buscar el cliente por su NIT
      const searchClient = await Client.findOne({ nit: nitCustomer });
      let clientId;

      const dataClient = {
        name: null,
        nit: null,
      };
      if (!searchClient) {
        // Crear el cliente si no existe
        const newClient = new Client({ name: nameCustomer, nit: nitCustomer });
        await newClient.save();
        dataClient.name = newClient.name;
        dataClient.nit = newClient.nit;
        clientId = newClient._id; // Casteo explícito
      } else {
        clientId = searchClient._id;
        dataClient.name = searchClient.name;
        dataClient.nit = searchClient.nit;
      }

      // Actualizar el stock de los productos
      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
          res.status(404).json({ msg: PRODUCT_ERRORS.PRODUCT_DOESNT_EXIST });
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
        paid_amount,
      });

      await order.save();

      const dataOfSell: IDataOfSell = {
        idTicket: order._id,
        date: order.date,
        customer: dataClient,
        items: products,
        total_amount: order.total_amount,
      };
      if (paid_amount) {
        createPrint(dataOfSell);
      }

      res.send("Orden creada correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Ha ocurrido un error al crear la orden" });
    }
  };

  static getAllOrders = async (req: Request, res: Response) => {
    try {
      const arrayOrders = await Order.find()
        .populate({
          path: "products.product",
          select: "name",
        })
        .populate("client");

      res.json({
        orders: arrayOrders,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static registerPartialPaid = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { paymentAmount } = req.body;
      const searchOrder = await Order.findById(id);
      if (!searchOrder) {
        const error = new Error(ORDER_ERRORS.ORDER_NOT_FOUND);
        res.status(404).json({ msg: error.message });
        return;
      }

      searchOrder.paid_amount += paymentAmount;

      searchOrder.payment_history.push({
        amount: paymentAmount,
        payment_method: "efectivo",
        date: new Date(),
      });
      await searchOrder.save();

      res.send(`Se ha abonado: ${paymentAmount} pesos a la orden.`);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ msg: "Ha ocurrido un error al registrar el pago parcial" });
    }
  };
  static markAsPaid = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const searchOrder = await Order.findById(id);
      if (!searchOrder) {
        const error = new Error(ORDER_ERRORS.ORDER_NOT_FOUND);
        res.status(404).json({ msg: error.message });
        return;
      }
      searchOrder.paid_amount = searchOrder.total_amount;
      await searchOrder.save();
      await validateIfClientHasDebts(searchOrder.client);
      res.send(`Se ha marcado la orden como pagada.`);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ msg: "Ha ocurrido un error al registrar el pago parcial" });
    }
  };
}
