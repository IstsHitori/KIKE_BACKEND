import { Response, Request } from "express";
import { Client } from "../models/Client";
import { CLIENT_ERRORS } from "../utils/errors";

export class ClientController {
  static getAllClients = async (req: Request, res: Response) => {
    try {
      const arrayClients = await Client.find();
      res.status(200).json({ clients: arrayClients });
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  static createClient = async (req: Request, res: Response) => {
    try {
      const { nit } = req.body;
      const searchClient = await Client.findOne({ nit });
      if (searchClient) {
        const error = new Error(CLIENT_ERRORS.CLIENT_ALREADY_EXIST);
        res.status(402).json({ msg: error.message });
        return;
      }
      const newClient = new Client(req.body);
      await newClient.save();
      res.send("Se ha registrado el cliente");
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  static deleteClient = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const searchClient = await Client.findById(id);
      if (!searchClient) {
        const error = new Error(CLIENT_ERRORS.CLIENT_NOT_EXIST);
        res.json({ msg: error.message });
        return;
      }
      await searchClient.deleteOne();
      res.send("Se ha eliminado el cliente");
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  static updateClient = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, nit, telephone, isDebtor } = req.body;
      const searchClient = await Client.findById(id);
      if (!searchClient) {
        const error = new Error(CLIENT_ERRORS.CLIENT_NOT_EXIST);
        res.json({ msg: error.message });
        return;
      }
      const searchClientNit = await Client.findOne({ nit });
      if (searchClientNit) {
        if (searchClientNit._id != id) {
          const error = new Error(CLIENT_ERRORS.CLIENT_ALREADY_EXIST);
          res.status(402).json({ msg: error.message });
          return;
        }
      }

      searchClient.name = name || searchClient.name;
      searchClient.nit = nit || searchClient.nit;
      searchClient.isDebtor = isDebtor;
      searchClient.telephone = telephone || searchClient.telephone;
      await searchClient.save();
      res.send("Se ha actualizado el cliente");
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
