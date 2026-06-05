import { body, param, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  next();
}

export const addToWishlistValidator = [
  param("productId").isMongoId().withMessage("Invalid product ID"),
  param("variantId").isMongoId().withMessage("Invalid variant ID"),
  validateRequest,
];

export const removeFromWishlistItemValidator = [
  param("productId").isMongoId().withMessage("Invalid product ID"),
  param("variantId").isMongoId().withMessage("Invalid variant ID"),
];