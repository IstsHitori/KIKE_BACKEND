import { Request, Response } from "express";
import { Category } from "../models/Category";
import { CATEGORY_ERRORS } from "../utils/errors";
import { Product } from "../models/Product";
export class CategoryController {
  static createCategory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { name } = req.body;

      // Buscar si la categoría ya existe
      const searchCategory = await Category.findOne({ name });
      if (searchCategory) {
        const error = new Error(CATEGORY_ERRORS.CATEGORY_EXIST);
        res.status(402).json({ msg: error.message }); // Enviar la respuesta sin retornar
        return; // Termina la ejecución
      }

      // Crear y guardar una nueva categoría
      const category = new Category(req.body);
      await category.save();
      res.status(201).send("Se ha creado la categoría"); // Enviar respuesta exitosa
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      res.status(500).json({ msg: "Internal server error" }); // Enviar una respuesta de error
    }
  };

  static getAllCategories = async (req: Request, res: Response) => {
    try {
      const array_categories = await Category.find();
      res.send({
        categories: array_categories,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      console.log(category);
      if (!category) {
        const error = new Error(CATEGORY_ERRORS.CATEGORY_DOESNT_EXIST);
        res.status(404).json({ msg: error.message });
        return;
      }

      const genericCategory = await Category.findOne({ name: "todos" });
      if (!genericCategory) {
        const error = new Error(CATEGORY_ERRORS.CATEGORY_DOESNT_EXIST);
        res.status(404).json({ msg: error.message });
        return;
      }

      await Product.updateMany(
        { category: id },
        { category: genericCategory._id }
      );

      await category.deleteOne();
      res.send("Se ha eliminado la categoria");
    } catch (error) {
      console.log(error);
    }
  };
  static updateCategory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      // Buscar si la categoría ya existe
      const searchCategory = await Category.findById(id);
      if (!searchCategory) {
        const error = new Error(CATEGORY_ERRORS.CATEGORY_DOESNT_EXIST);
        res.status(402).json({ msg: error.message }); // Enviar la respuesta sin retornar
        return; // Termina la ejecución
      }
      // Crear y actualizar la categoría
      searchCategory.name = name || searchCategory.name;
      searchCategory.description = description || searchCategory.description;
      await searchCategory.save();
      res.status(200).send("Se ha actualizado la categoría"); // Enviar respuesta exitosa
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      res.status(500).json({ msg: "Internal server error" }); // Enviar una respuesta de error
    }
  };
}
