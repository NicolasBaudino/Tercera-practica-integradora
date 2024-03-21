import { Router } from "express";
import { getProductsController, getProductByIdController, addProductController, updateProductController, deleteProductController } from "../controllers/products.controller.js";
import { hasAdminPermission } from "../middlewares/permissions.middleware.js";
import { passportCall } from "../utils.js";

const router = Router();

router.get('/', getProductsController);

router.get('/:pid', getProductByIdController);

router.post('/', passportCall('jwt'), hasAdminPermission(), addProductController);

router.put('/:pid', passportCall('jwt'), hasAdminPermission(), updateProductController);

router.delete('/:pid', passportCall('jwt'), hasAdminPermission(), deleteProductController);

export default router;