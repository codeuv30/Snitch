import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { addToCartValidator, decrementQuantityValidator, incrementQuantityValidator, removeItemValidator } from "../validators/cart.validator.js";
import { addToCart, createOrderController, decrementQuantity, getCart, incrementQuantity, removeItem, verifyOrderController } from "../controllers/cart.controller.js";

const cartRouter = express.Router();

/**
 * @route POST /api/v1/cart/add/:productId/:variantId
 * @description Add item to cart
 * @param productId - ID of product to add in the cart
 * @param variantId = ID of variant to add in the cart
 * @access Private
*/
cartRouter.post("/add/:productId/:variantId", authenticateUser, addToCartValidator, addToCart);

/**
 * @route POST /api/v1/cart/increment/:productId/:variantId
 * @description Increment quantity of item in cart
 * @param productId - ID of product to increment in the cart
 * @param variantId = ID of variant to increment the cart
 * @access Private
*/
cartRouter.post('/increment/:productId/:variantId', authenticateUser, incrementQuantityValidator, incrementQuantity);

/**
 * @route POST /api/v1/cart/decrement/:productId/:variantId
 * @description Decrement quantity of item in cart
 * @param productId - ID of product to decrement in the cart
 * @param variantId = ID of variant to decrement the cart
 * @access Private
*/
cartRouter.post('/decrement/:productId/:variantId', authenticateUser, decrementQuantityValidator, decrementQuantity);

/**
 * @route GET /api/v1/cart
 * @description Get your cart items
 * @access Private
*/
cartRouter.get("/", authenticateUser, getCart);

/**
 * @route POST /api/v1/cart/remove/:productId/:variantId
 * @description Remove item to cart
 * @param productId - ID of product to remove in the cart
 * @param variantId = ID of variant to remove in the cart
 * @access Private
*/
cartRouter.post("/remove/:productId/:variantId", authenticateUser, removeItemValidator, removeItem);

/**
 * @route POST api/v1/cart/payment/create/order
*/
cartRouter.post('/payment/create/order', authenticateUser, createOrderController);

cartRouter.post("/payment/verify/order", authenticateUser, verifyOrderController);

export default cartRouter;