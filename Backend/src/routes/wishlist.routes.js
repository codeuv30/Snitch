import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { addToWishlistValidator } from "../validators/wishlist.validator.js";
import { addToWishlist, getWishlist, removeItemFromWishlist } from "../controllers/wishlist.controller.js";

const wishlistRouter = express.Router();

/**
 * @route POST /api/v1/wishlist/add/:productId/:variantId
 * @description Add item to wishlist
 * @param productId - ID of product to add in the wishlist
 * @param variantId = ID of variant to add in the wishlist
 * @access Private
*/
wishlistRouter.post("/add/:productId/:variantId", authenticateUser, addToWishlistValidator, addToWishlist);

/**
 * @route GET /api/v1/wishlist
 * @description Get your wishlist items
 * @access Private
*/
wishlistRouter.get("/", authenticateUser, getWishlist);

/**
 * @route POST /api/v1/wishlist/remove/:productId/:variantId
 * @description Remove item to wishlist
 * @param productId - ID of product to remove in the wishlist
 * @param variantId = ID of variant to remove in the wishlist
 * @access Private
*/
wishlistRouter.post("/remove/:productId/:variantId", authenticateUser, removeItemFromWishlist, removeItemFromWishlist);

export default wishlistRouter;