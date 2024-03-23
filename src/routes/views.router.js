import { Router } from "express";
import productDao from "../daos/dbManager/product.dao.js";
import cartDao from "../daos/dbManager/cart.dao.js";
import { hasAdminPermission, hasUserPermission } from "../middlewares/permissions.middleware.js";
import { passportCall } from "../utils.js";
import { productService } from "../services/service.js";


const router = Router();
router.get("/", (req, res) => {
    res.render("home.hbs");
});

router.get("/products", async (req,res) => {
    const { limit, page, query, sort } = req.query;
    const products = await productDao.findProducts(limit, page, query, sort);

    const userData = req.session.user;
    const welcomeMessage = 'Bienvenido';

    res.render("products.hbs", { products, user: userData, welcomeMessage }, (err, html) => {
        if (err) {
            throw err
        }
        res.send(html)
    })
})

router.get("/carts/:id", async (req,res) => {
    const { id } = req.params;
    const products = await cartDao.getProductsFromCart(id);
    console.log(products)
    res.render("cart.hbs", {products});
})

router.get("/chat", passportCall('jwt'), hasUserPermission(), async (req, res) => {
    res.render("chat", {});
});


export default router;