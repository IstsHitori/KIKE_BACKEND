import jwt from "jsonwebtoken";
import { Types } from "mongoose";
interface VeterinaryPayload {
  id: Types.ObjectId;
}

export const generateJWT = (payload: VeterinaryPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "180d",
  });
  return token;
};
