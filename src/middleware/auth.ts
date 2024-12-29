import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      User?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }
  const token = bearer.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded === "object" && decoded.id) {
      const user = await User.findById(decoded.id).select("_id user");
      if (!user) {
        res.status(500).json({ error: "Token no valido" });
      }
      req.User = user;
    }
  } catch (error) {
    res.status(500).json({ error: "Token no valido" });
  }
  next();
};
