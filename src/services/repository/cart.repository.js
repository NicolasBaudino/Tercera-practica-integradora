export default class cartRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    createCart = async (cart) => {
      return await this.dao.createCart(cart);
    };
    
    updateCart = async (_id, cart) => {
      return await this.dao.updateCart({ _id }, cart);
    };

    getCartById = async (id) => {
      try {
        return await this.dao.getCartById(id);
      } catch (error) {
        throw new Error(error.message);
      }
    };

    getProductsFromCart = async (id) => {
      try{
        return await this.dao.getProductsFromCart(id);
      } catch (error) {
        throw new Error(error.message);
      }
    }

    deleteCart = async (id) => {
      try{
        return await this.dao.deleteCart(id);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  
    addProductCart = async (cartId, productId) => {
      try {
        return await this.dao.addProductCart(cartId, productId);
      } catch (error) {
        throw new Error(error.message);
      }
    };
  
    deleteAllProductsFromCart = async (cartId) => {
      try {
        return await this.dao.deleteAllProductsFromCart(cartId);
      } catch (error) {
        throw new Error(error.message);
      }
    };
  
    updateCartWithProducts = async (cartId, newProducts) => {
      try {
        return await this.dao.updateCartWithProducts(cartId, newProducts);
      } catch (error) {
        throw new Error(error.message);
      }
    };
  
    updateProductQuantity = async (cartId, productId, newQuantity) => {
      try {
        return await this.dao.updateProductQuantity(cartId, productId, newQuantity);
      } catch (error) {
        throw new Error(error.message);
      }
    };
  
    deleteProductFromCart = async (cartId, productId) => {
      try {
        return await this.dao.deleteProductFromCart(cartId, productId);
      } catch (error) {
        throw new Error(error.message);
      }
    };

    purchaseCart = async (cartId, cartProducts, purchaserEmail) => {
      try {
        return await this.dao.purchaseCart(cartId, cartProducts, purchaserEmail);
      } catch (error) {
        throw new Error(error.message);
      }
    };
}