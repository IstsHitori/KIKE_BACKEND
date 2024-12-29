import { Request, Response } from "express";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { ORDER_ERRORS, PRODUCT_ERRORS } from "../utils/errors";
import mongoose from "mongoose";

export class ProductController {
  static createProduct = async (req: Request, res: Response) => {
    try {
      const { name, code } = req.body;
      const searchProduct = await Product.findOne({
        $or: [{ name }, { code }],
      });
      if (searchProduct) {
        const error = new Error(PRODUCT_ERRORS.PRODUCT_EXIST);
        res.status(400).json({ msg: error.message });
        return;
      }
      const product = new Product(req.body);
      await product.save();

      res.send("Se ha creado el producto");
    } catch (error) {
      console.log(error);
    }
  };
  static getAllProducts = async (req: Request, res: Response) => {
    try {
      const array_products = await Product.find().populate(
        "category",
        "-_id name"
      );
      res.json({ products: array_products });
    } catch (error) {
      console.log(error);
    }
  };
  static deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      const objectId = new mongoose.Types.ObjectId(id);

      if (!product) {
        const error = new Error(PRODUCT_ERRORS.PRODUCT_DOESNT_EXIST);
        res.status(404).json({ msg: error.message });
        return;
      }
      const existProductInOrder = await Order.findOne({
        "items.product": objectId,
      });

      if (existProductInOrder) {
        const error = new Error(ORDER_ERRORS.PRODUCT_IN_ORDER);
        res.status(405).json({ msg: error.message });
        return;
      }
      await product.deleteOne();
      res.send("Se ha eliminado el producto");
    } catch (error) {
      console.log(error);
    }
  };
  static updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, price, witght, stock, category, brand, code, description } =
        req.body;
      const searchProduct = await Product.findById(id);
      if (!searchProduct) {
        const error = new Error(PRODUCT_ERRORS.PRODUCT_DOESNT_EXIST);
        res.status(404).json({ msg: error.message });
        return;
      }
      searchProduct.name = name || searchProduct.name;
      searchProduct.price = price || searchProduct.price;
      searchProduct.weight = witght || searchProduct.weight;
      searchProduct.stock = stock || searchProduct.stock;
      searchProduct.category = category || searchProduct.category;
      searchProduct.brand = brand || searchProduct.brand;
      searchProduct.code = code || searchProduct.code;
      searchProduct.description = description || searchProduct.description;

      await searchProduct.save();
      res.send("Se ha actualizado el producto");
    } catch (error) {
      console.log(error);
    }
  };
}
