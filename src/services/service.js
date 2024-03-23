import cartsDAO from "./dao/mongo/cart.services.js";
import productsDAO from "./dao/mongo/products.services.js";
import ticketDAO from "./dao/mongo/ticket.services.js";
import userDAO from "./dao/mongo/user.services.js";
import emailDAO from "./dao/mongo/email.dao.js";

import cartRepository from "./repository/cart.repository.js";
import productRepository from "./repository/products.repository.js";
import ticketRepository from "./repository/ticket.repository.js";
import userRepository from "./repository/user.repository.js";
import emailRepository from "./repository/email.repository.js";

const cartDao = new cartsDAO();
const productDao = new productsDAO();
const ticketDao = new ticketDAO();
const userDao = new userDAO();
const emailDao = new emailDAO();

export const cartService = new cartRepository(cartDao);
export const productService = new productRepository(productDao);
export const ticketService = new ticketRepository(ticketDao);
export const userService = new userRepository(userDao);
export const emailService = new emailRepository(emailDao);