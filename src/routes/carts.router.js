import { Router } from "express";
import { getCartsController, createCartController, getCartByIdController, updateCartController, deleteCartByCartIdController, addProductByCartIdController, updateQuantityProductController, deleteProductByCartIdController, finishPurchase} from "../controllers/cart.controller.js";
import { passportCall } from "../utils.js";
import { hasUserPermission } from "../middlewares/permissions.middleware.js";

const router = Router();

router.get("/", getCartsController);

router.post("/", createCartController);

router.put("/:cid", updateCartController);

router.delete("/:cid", deleteCartByCartIdController);

router.post("/:cid/products/:pid", passportCall('jwt'), hasUserPermission(), addProductByCartIdController);

router.put('/:cid/products/:pid', updateQuantityProductController);

router.delete("/:cid/products/:pid", deleteProductByCartIdController);

router.get('/:cid/purchase', passportCall('jwt'), finishPurchase)

export default router;