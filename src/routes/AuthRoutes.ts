import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
const router = Router();

router.post(
  "/create-account",
  body("user")
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio")
    .isLength({ min: 4 })
    .withMessage("El nombre de usuario debe ser mínimo 4 carácteres"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser mínimo 6 carácteres")
    .notEmpty()
    .withMessage("El password es obligatorio"),
  handleInputErrors,
  AuthController.createAccount
);
router.post(
  "/login",
  body("user").notEmpty().withMessage("El nombre de usuario es obligatorio"),
  body("password")
    .notEmpty()
    .withMessage("El password del usuario es obligatorio"),
  handleInputErrors,
  AuthController.login
);

router.get("/get-profile", authenticate, AuthController.getProfile);

export default router;
