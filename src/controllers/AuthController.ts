import { Request, Response } from "express";
import { hashPassword, checkPassword } from "../utils/auth";
import { User } from "../models/User";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, user } = req.body;
      //Prevenir duplicados
      const existUser = await User.findOne({ user });
      if (existUser) {
        const error = new Error("El usuario ya está registrado");

        res.status(409).json({ error: error.message });
        return;
      }
      const createUser = new User(req.body);
      //Hash password
      createUser.password = await hashPassword(password);

      await Promise.allSettled([createUser.save()]);
      res.send("Cuenta creada");
    } catch (error) {
      console.log(error.message);
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { user, password } = req.body;
      const searchUser = await User.findOne({ user });
      if (!searchUser) {
        const error = new Error("Usuario no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }
      //Revisar password

      const isPasswordCorrect = await checkPassword(
        password,
        searchUser.password
      );

      if (!isPasswordCorrect) {
        const error = new Error("Password incorrecto");
        res.status(401).json({ error: error.message });
        return;
      }

      const token = generateJWT({ id: searchUser.id });
      res.send(token);
    } catch (error) {
      console.log("hubo un error");

      console.log(error.message);
    }
  };

  static getProfile = async (req: Request, res: Response) => {
    const User = req.User;
    if (!User) {
      const error = new Error("Usuario no encontrado");
      res.status(401).json({ error: error.message });
      return;
    }

    res.json({
      user: User.user,
    });
  };
}
