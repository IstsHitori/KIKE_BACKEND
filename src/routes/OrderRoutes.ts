import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { OrderController } from "../controllers/OrderController";
import { handleInputErrors } from "../middleware/validation";
import { body, param } from "express-validator";
import { CLIENT_ERRORS, ORDER_ERRORS } from "../utils/errors";

const router = Router();
router.get("", authenticate, OrderController.getAllOrders);
router.post(
  "/create-order",
  body("nitCustomer")
    .notEmpty()
    .withMessage(ORDER_ERRORS.NIT_CLIENT_EMPTY)
    .isInt()
    .withMessage(ORDER_ERRORS.NIT_CLIENT_NOT_NUMBER),
  body("nameCustomer").notEmpty().withMessage(CLIENT_ERRORS.NAME_EMPTY),
  body("products")
    .notEmpty()
    .withMessage(ORDER_ERRORS.ITEM_EMPTY)
    .isArray({ min: 1 })
    .withMessage(ORDER_ERRORS.PRODUCTS_LENGTH),
  body("total_amount").notEmpty().withMessage(ORDER_ERRORS.TOTAL_AMOUNT_EMPTY),
  OrderController.createOrder
);
router.post(
  "/register-paid/:id",
  param("id").isMongoId().withMessage(ORDER_ERRORS.ID_ORDER_NOT_VALID),
  body("paymentAmount")
    .notEmpty()
    .withMessage(ORDER_ERRORS.PAYMENT_AMOUNT_EMPTY),
  handleInputErrors,
  authenticate,
  OrderController.registerPartialPaid
);
router.patch(
  "/mark-as-paid/:id",
  param("id").isMongoId().withMessage(ORDER_ERRORS.ID_ORDER_NOT_VALID),
  handleInputErrors,
  authenticate,
  OrderController.markAsPaid
);
export default router;
