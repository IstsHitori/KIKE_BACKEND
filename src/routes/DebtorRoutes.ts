import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { DebtorController } from "../controllers/DebtorController";
import { handleInputErrors } from "../middleware/validation";
import { body, param } from "express-validator";
import { CLIENT_ERRORS, DEBTOR_ERRORS } from "../utils/errors";

const router = Router();

router.get("/", authenticate, DebtorController.getAllDebtors);
router.post(
  "/create-debtor",
  body("client").notEmpty().withMessage(DEBTOR_ERRORS.CLIENT_EMPTY),
  handleInputErrors,
  authenticate,
  DebtorController.createDebtor
);
router.patch(
  "/:id",
  param("id").isMongoId().withMessage(DEBTOR_ERRORS.ID_NOT_VALID),
  handleInputErrors,
  authenticate,
  DebtorController.changeStatus
);
router.delete(
  "/:id",
  param("id").isMongoId().withMessage(DEBTOR_ERRORS.ID_NOT_VALID),
  handleInputErrors,
  authenticate,
  DebtorController.deleteDebtor
);
router.get(
  "/:id",
  param("id").isMongoId().withMessage(CLIENT_ERRORS.ID_NOT_VALID),
  handleInputErrors,
  authenticate,
  DebtorController.getDebtsByClient
);

export default router;
