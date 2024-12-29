import { Router } from "express";
import { ClientController } from "../controllers/ClientController";
import { authenticate } from "../middleware/auth";
import { handleInputErrors } from "../middleware/validation";
import { body, param } from "express-validator";
import { CLIENT_ERRORS } from "../utils/errors";

const router = Router();

router.get("/", authenticate, ClientController.getAllClients);
router.post(
  "/create-client",
  body("name").notEmpty().withMessage(CLIENT_ERRORS.NAME_EMPTY),
  body("nit").notEmpty().withMessage(CLIENT_ERRORS.NIT_EMPTY),
  handleInputErrors,
  authenticate,
  ClientController.createClient
);
router.delete(
  "/delete-client/:id",
  param("id").isMongoId().withMessage(CLIENT_ERRORS.ID_NOT_VALID),
  handleInputErrors,
  authenticate,
  ClientController.deleteClient
);
router.put("/update-client/:id",authenticate,ClientController.updateClient)
export default router;
