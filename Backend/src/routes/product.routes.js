import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProduct, deleteProduct, getSellerProducts } from "../controllers/product.controller.js";
import multer from "multer"
import { productValidator } from "../validators/product.validator.js";

const productRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

/**
 * @route POST /api/v1/products
 * @desc Create a new product (Seller only)
 * @access Private
 * @body { title: String, description: String, price: Number, images: [File] }
*/
productRouter.post("/", authenticateSeller, upload.array('images', 7), productValidator, createProduct);

/**
 * @route GET /api/v1/products/seller
 * @desc Get all products of the seller (Seller only)
 * @access Private
*/
productRouter.get("/seller", authenticateSeller, getSellerProducts);

/**
 * @route GET /api/v1/products/delete/:productId
 * @param {String} productId - ID of the product to delete
 * @desc Delete a product by ID (Seller only)
 * @access Private
*/
productRouter.get("/delete/:productId", authenticateSeller, deleteProduct);

export default productRouter;