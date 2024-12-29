import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { ProductController } from "../controllers/ProductController";
import { PRODUCT_ERRORS } from "../utils/errors";

const router = Router();

router.get("/", authenticate, ProductController.getAllProducts);
router.post(
  "/create-product",
  body("name").notEmpty().withMessage(PRODUCT_ERRORS.NAME_EMPTY),
  body("brand").notEmpty().withMessage(PRODUCT_ERRORS.BRAND_EMPTY),
  body("price")
    .notEmpty()
    .withMessage(PRODUCT_ERRORS.PRICE_EMPTY)
    .isNumeric()
    .withMessage(PRODUCT_ERRORS.PRICE_ARE_NOT_NUMBER),
  body("weight").notEmpty().withMessage(PRODUCT_ERRORS.WEIGHT_EMPTY),
  body("description").notEmpty().withMessage(PRODUCT_ERRORS.DESCRIPTION_EMPTY),
  body("code").notEmpty().withMessage(PRODUCT_ERRORS.CODE_EMPTY),
  body("stock").notEmpty().withMessage(PRODUCT_ERRORS.QUANTITY_EMPTY),
  body("category")
    .isMongoId()
    .withMessage(PRODUCT_ERRORS.CATEGORY_ID_NOT_VALID)
    .notEmpty()
    .withMessage(PRODUCT_ERRORS.CATEGORY_EMPTY),
  handleInputErrors,
  authenticate,
  ProductController.createProduct
);
router.put(
  "/update-product/:id",
  param("id").isMongoId().withMessage(PRODUCT_ERRORS.PRODUCT_ID_NOT_VALID),
  handleInputErrors,
  authenticate,
  ProductController.updateProduct
);
router.delete(
  "/delete-product/:id",
  param("id").isMongoId().withMessage(PRODUCT_ERRORS.PRODUCT_ID_NOT_VALID),
  handleInputErrors,
  authenticate,
  ProductController.deleteProduct
);
export default router;
