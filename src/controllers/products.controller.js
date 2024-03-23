// getDataControllers, postDataControllers, updateDataControllers, deleteDataControllers
// import { findProducts, findProductById, createProducts, updateProducts, deleteProducts } from "../services/dao/mongo/products.services.js";

import { productService } from "../services/service.js";
import CustomError from "../services/errors/customError.js";
import { generateProductErrorInfo } from "../services/errors/infoError.js";
import { EErrors } from "../services/errors/enumsError.js";
import { authToken } from "../utils.js";

export const getProductsController = async (req, res) => {
    const { limit, page, sort, query } = req.query;
  
    const productData = await productService.findProducts(limit, page, sort, query);
  
    res.status(200).json({ productData });
};

export const getProductByIdController = async (req, res) => {
    const { pid } = req.params;
  
    try {
      const productFind = await productService.findProductById(pid);
      res.status(200).json({ productSelected: productFind });
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
};

export const addProductController = async (req, res) => {
    const product = req.body;
  
    try {
      if (
        product.title === undefined ||
        product.description === undefined ||
        product.price === undefined ||
        product.thumbnails === undefined ||
        product.category === undefined ||
        product.code === undefined ||
        product.stock === undefined
      ) {
        CustomError.createError({
          name: "Product creation error",
          cause: generateProductErrorInfo(product),
          message:
            "Product cannot be created. Please see your console for details.",
          code: EErrors.MISSING_PROPERTY_ERROR,
        });
      }

      const productCreated = await productService.createProducts(product);
      res.status(201).json({
        message: "Product succesfully created",
        productCreated: productCreated,
      });
    } catch (error) {
      console.log("[ERROR]: " + error.cause);
      res.status(400).json({
        error: error.name,
        message: error.message,
        code: error.code,
      });
    }
      
};

export const updateProductController = async (req, res) => {
    const { pid } = req.params;
    const productReq = req.body;
  
    try {
      const updateProductResult = await productService.updateProducts(pid, productReq);
      res.status(200).json({ 
        message: "Product has modified", 
        productModified: updateProductResult
      });
    } catch (e) {
      res.status(500).json({
        error: e.message,
      });
    }
};

export const deleteProductController = [authToken, async (req, res) => {
  const { pid } = req.params;
  try {
      const product = await productService.findProductById(pid);
      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }

      if (req.user.role !== "admin" && req.user.email !== product.owner) {
          return res.status(403).json({ message: "Forbidden: user doesn't have permission to delete this product." });
      }

      await productService.deleteProducts(pid);
      res.status(200).json({
          message: "Content successfully deleted!",
      });
  } catch (error) {
      console.error(error);
      res.status(400).json({
          error: error.message,
      });
  }
}];