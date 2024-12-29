import { Router } from "express";
import { body, param } from "express-validator";
import { CategoryController } from "../controllers/CategoryController";
import { handleInputErrors } from "../middleware/validation";
import { CATEGORY_ERRORS } from "../utils/errors";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, CategoryController.getAllCategories);
router.post(
  "/create-category",
  body("name").notEmpty().withMessage(CATEGORY_ERRORS.NAME_EMPTY),
  body("description").notEmpty().withMessage(CATEGORY_ERRORS.DESCRIPTION_EMPTY),
  handleInputErrors,
  authenticate,
  CategoryController.createCategory
);
router.delete(
  "/delete-category/:id",
  param("id").isMongoId().withMessage(CATEGORY_ERRORS.ID_NOT_VALID),
  handleInputErrors,
  authenticate,
  CategoryController.deleteCategory
);
router.put(
  "/update-category/:id",
  param("id").isMongoId().withMessage(CATEGORY_ERRORS.ID_NOT_VALID),
  handleInputErrors,
  authenticate,
  CategoryController.updateCategory
);

export default router;
