import { Debtor } from "../models/Debtor";
import { Request, Response } from "express";
import { CLIENT_ERRORS, DEBTOR_ERRORS } from "../utils/errors";
import { Client } from "../models/Client";

export class DebtorController {
  static getAllDebtors = async (req: Request, res: Response) => {
    try {
      const arrayDebtors = await Debtor.find();
      res.json({ debtors: arrayDebtors });
    } catch (error) {
      console.log(error);
    }
  };
  static createDebtor = async (req: Request, res: Response) => {
    try {
      const { client, owedProducts, owedServices, totalDebt } = req.body;

      //Validar si existe
      const searchDebtor = await Debtor.findOne({ client });
      if (searchDebtor) {
        const error = new Error(DEBTOR_ERRORS.DEBTOR_ALREADY_EXIST);
        res.status(500).json({ msg: error.message });
        return;
      }
      // Crear nuevo deudor
      const newDebtor = new Debtor({
        client,
        owedProducts: owedProducts || [], // Opcional: Productos adeudados
        owedServices: owedServices || [], // Opcional: Servicios adeudados
        totalDebt: totalDebt || 0, // Opcional: Deuda total
      });

      // Guardar en la base de datos
      await newDebtor.save();

      res.send("Se ha creado el deudor correctamente");
    } catch (error) {
      console.error("Error al crear un deudor:", error);
    }
  };
  static changeStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const searchDebtor = await Debtor.findById(id);
      if (!searchDebtor) {
        const error = new Error(DEBTOR_ERRORS.DEBTOR_NOT_EXIST);
        res.status(404).json({ msg: error.message });
        return;
      }
      searchDebtor.status = !searchDebtor.status;
      await searchDebtor.save();
    } catch (error) {
      console.log(error);
    }
  };
  static deleteDebtor = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const searchDebtor = await Debtor.findById(id);
      if (!searchDebtor) {
        const error = new Error(DEBTOR_ERRORS.DEBTOR_NOT_EXIST);
        res.status(404).json({ msg: error.message });
        return;
      }
      await searchDebtor.deleteOne();
    } catch (error) {
      console.log(error);
    }
  };
  static getDebtsByClient = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const searchClient = await Client.findById(id);
      if (!searchClient) {
        const error = new Error(CLIENT_ERRORS.CLIENT_NOT_EXIST);
        res.status(404).json({ msg: error.message });
        return;
      }
      const arrayDebts = await Debtor.find({ client: id });

      res.json({ debtsClient: arrayDebts });
    } catch (error) {
      console.log(error);
    }
  };
}
