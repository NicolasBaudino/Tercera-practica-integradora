import { cartModel } from "../../../models/cart.model.js";
import { productModel } from "../../../models/product.model.js";
import { ticketModel } from "../../../models/ticket.model.js";

export default class cartsDAO {
  constructor () {} 
     
  findCarts = async () => {
      return await cartModel.find();
  }

  createCart = async (cart) => {
      return await cartModel.create(cart);
  }

  getCartById = async (id) => {
      return await cartModel.findById(id);
  }

  updateCart = async (_id, cart) => {
      return await cartModel.findByIdAndUpdate({ _id }, cart);
  }

  deleteCart = async (_id) => {
      return await cartModel.findByIdAndDelete({ _id });
  }

  getProductsFromCart = async (id) => {
      return await cartModel.findById(id).populate('products.product').lean();
  }

  addProductCart = async (cartId, productId) => {
      try {
          const cart = await cartModel.findById(cartId);
          if (!cart) {
              throw new Error('Carrito no encontrado');
          }

          const product = await productModel.findById(productId);
          if (!product) {
              throw new Error('Producto no encontrado');
          }

          const existingProduct = cart.products.find(p => p._id.equals(productId));

          if (existingProduct) {
              existingProduct.quantity += 1;
          } else {
              cart.products.push({
                  _id: productId,
                  quantity: 1
              });
          }

          await cart.save();

          return 'Se añadió el producto al carrito';
      } catch (error) {
          throw error;
      }
  };

  updateProductQuantity = async (cartId, productId, newQuantity) => {
      try {
        const cart = await cartModel.findById(cartId);
    
        if (!cart) {
          throw new Error('Carrito no encontrado');
        }
    
        const product = cart.products.find(p => p._id.equals(productId));
    
        if (!product) {
          throw new Error('Producto no encontrado en el carrito');
        }
    
        product.quantity = newQuantity;
        await cart.save();
    
        return cart;
      } catch (error) {
        throw error;
      }
  }

  deleteProductFromCart = async (cartId, productId) => {
      try {
        const cart = await cartModel.findById(cartId);
    
        if (!cart) {
          throw new Error('Carrito no encontrado');
        }
    
        const initialProductCount = cart.products.length;
    
        cart.products = cart.products.filter(p => !p._id.equals(productId));
    
        if (cart.products.length === initialProductCount) {
          throw new Error('Producto no encontrado en el carrito');
        }
    
        await cart.save();
    
        return cart;
      } catch (error) {
        throw error;
      }
  }

  updateCartWithProducts = async (cartId, newProducts) => {
      try {
        const cart = await cartModel.findById(cartId);
    
        if (!cart) {
          throw new Error('Carrito no encontrado');
        }
    
        cart.products = [];
    
        newProducts.forEach(product => {
          cart.products.push({
            product: product.productId,
            quantity: product.quantity
          });
        });
    
        await cart.save();
    
        return cart;
      } catch (error) {
        throw error;
      }
  }

  deleteAllProductsFromCart = async (cartId) => {
      try {
        const cart = await cartModel.findById(cartId);
    
        if (!cart) {
          throw new Error('Carrito no encontrado');
        }
    
        cart.products = [];
        await cart.save();
    
        return cart;
      } catch (error) {
        throw error;
      }
  }

  purchaseCart = async (cartId, cartProducts, purchaserEmail) => {
    try {
      const failedProducts = [];
      let totalAmount = 0;
  
      for (const cartProduct of cartProducts) {
        const productIdObject = cartProduct._id;
        const productId = productIdObject.toString()
        const requestedQuantity = cartProduct.quantity;
        console.log(productId)
        const product = await productModel.findById(productId);
        console.log(product)

        if (product.stock >= requestedQuantity) {
          totalAmount += product.price * requestedQuantity;
          product.stock -= requestedQuantity;
          await product.save();
        } else {
          failedProducts.push({ productId, requestedQuantity });
        }
      }

      if (totalAmount > 0) {
        const ticketData = {
          amount: totalAmount,
          purchaser: purchaserEmail,
        };
  
        const ticket = await ticketModel.create(ticketData);

        return { failedProducts, ticketId: ticket._id };
      } else {

        return { failedProducts };
      }
    } catch (error) {
      console.log("Error in purchaseCart function:", error);
      throw new Error("Error processing the purchase.", error);
    }
  };
}

