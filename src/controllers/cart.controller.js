// import { findCarts, createCart, getCartById, addProductCart, updateProductQuantity, deleteProductFromCart, updateCartWithProducts, deleteAllProductsFromCart } from "../services/dao/mongo/cart.services.js";

import { cartService, ticketService, productService } from "../services/service.js";
import TicketDto from "../services/dto/ticket.dto.js";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { authToken } from "../utils.js";

export const getCartsController = async (req, res) => {
    try {
      const carts = await cartService.findCarts();
      res.status(200).json({ carts: carts });
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
};
  
export const createCartController = async (req, res) => {
    try {
        const cart = await cartService.createCart(req.body);
        res.json({
            cart,
            message: "Cart created"
        })
    }
    catch(error) {
        console.log(error);
        res.json({
            error,
            message: "Error"
        });
    }
};
  
export const getCartByIdController = async (req, res) => {
    const { cid } = req.params;

    try {
        const cartSelected = await cartService.getCartById(cid);
        res.status(200).json({ cartSelected: cartSelected });
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
};

export const updateCartController = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
  
    try {
      const result = await cartService.updateCartWithProducts(cid, products);
      res.json({
        result,
        message: "Cart updated"
        })
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

export const deleteCartByCartIdController = async (req, res) => {
    const { cid } = req.params;
  
    try {
      const result = await cartService.deleteAllProductsFromCart(cid);
      res.json({
        result,
        message: "Products deleted"
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

export const addProductByCartIdController = [authToken, async (req, res) => {
    const { cid, pid } = req.params;
    try {
      const product = await productService.findProductById(pid);
      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }
      if (req.user.role == "premium" && req.user.email == product.owner) {
        return res.status(403).json({ message: "Forbidden: premiums doesn't have the permission to add his own product to cart." });
      }
      
      const result = await cartService.addProductCart(cid, pid);
      res.json({
          result,
          message: "Product added"
      });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}];

export const updateQuantityProductController = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
    const result = await cartService.updateProductQuantity(cid, pid, quantity);
    res.json({
        result,
        message: "Product updated"
    });
    } catch (error) {
     res.status(500).json({ error: error.message });
    } 
};

export const deleteProductByCartIdController = async (req, res) => {
    const { cid, pid } = req.params;
    try {
      const result = await cartService.deleteProductFromCart(cid, pid);
      res.json({
        result,
        message: "Product deleted"
    });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// export const finishPurchase = async (req,res) =>{
//     // const { cid } = req.params;
//     // try {
//     //     let cart = await cartService.getCartById(cid)

//     //     let total_price = 0;
//     //     let unstocked_products = []
//     //     for(const item of cart.products){
//     //         let product = await productService.findProductById(item._id.toString())
//     //         if(product.stock >= item.quantity){
//     //             total_price += item.quantity * product.price
//     //             let stockLoweing = await productService.updateProducts(item._id.toString(),{stock:product.stock - item.quantity})
//     //         }
//     //         else{
//     //             unstocked_products.push({product:product._id,quantity:item.quantity})
//     //         }
//     //     }

//     //     if(total_price > 0){
//     //     cart.products = unstocked_products
//     //     let newCart = await cartService.updateCart(cid, cart)
//     //     let newTicket = await ticketService.createTicket({code:`${cid}_${Date.now()}`,amount:total_price,purchaser:req.user.email})
//     //     return res.status(200).json(new TicketDto(newTicket))
//     //     } 
//     //     else{
//     //         return res.status(404).json({message:"No purchase made"})
//     //     }
//     // }
//     // catch (err) {
//     //     return res.status(404).json({message: err});
//     // }
// }

export const finishPurchase = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const { email } = req.body

      const cartProducts = await cartService.getProductsFromCart(cartId);

      const result = await cartService.purchaseCart(cartId, cartProducts.products, email);

      if (result.failedProducts.length > 0) {
        await cartService.deleteCart(cartId);
        res.status(200).json({ 
          message: "Purchase completed with some products not processed successfully.",
          failedProducts: result.failedProducts
        });
      } else {
        await cartService.deleteCart(cartId);
        res.status(200).json({ message: "Purchase completed successfully." });
      }
    } catch (error) {
      console.error("Error in purchaseCart function:", error);
      res.status(500).json({ error, message: "Error completing the purchase." });
    }
  }