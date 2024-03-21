import cartsDAO from "./dao/mongo/cart.services.js";
import productsDAO from "./dao/mongo/products.services.js";
import ticketDAO from "./dao/mongo/ticket.services.js";

import cartRepository from "./repository/cart.repository.js";
import productRepository from "./repository/products.repository.js";
import ticketRepository from "./repository/ticket.repository.js";

const cartDao = new cartsDAO();
const productDao = new productsDAO();
const ticketDao = new ticketDAO();

export const cartService = new cartRepository(cartDao);
export const productService = new productRepository(productDao);
export const ticketService = new ticketRepository(ticketDao);