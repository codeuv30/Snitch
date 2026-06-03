import { Router } from "express";
import {
  authenticateSeller,
  authenticateUser,
  optionalAuth,
} from "../middlewares/auth.middleware.js";
import {
  addView,
  createProduct,
  createProductVariant,
  deleteProduct,
  editProductVariant,
  editSellerProduct,
  getAllProducts,
  getProductDetails,
  getSellerProducts,
  getVariant,
} from "../controllers/product.controller.js";
import multer from "multer";
import {
  createProductValidator,
  createProductVariantValidator,
  editProductValidator,
  editProductVariantValidator,
} from "../validators/product.validator.js";

const productRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

const createProductUploadMiddleware = (req, res, next) => {
  upload.array("thumbnail", 1)(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large.",
        });
      }

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        if (err.field !== "thumbnail") {
          return res.status(400).json({
            success: false,
            message:
              "Unexpected field. Please use 'thumbnail' as the field name.",
          });
        }

        if (err.field === "thumbnail") {
          return res.status(400).json({
            success: false,
            message: "Too many files. Maximum 1 images allowed.",
          });
        }
      }

      return res.status(500).json({ success: false, message: "Upload error." });
    }
    next();
  });
};

const addVariantUploadMiddleware = (req, res, next) => {
  upload.array("images", 7)(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large.",
        });
      }

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        if (err.field !== "images") {
          return res.status(400).json({
            success: false,
            message: "Unexpected field. Please use 'images' as the field name.",
          });
        }

        if (err.field === "images") {
          return res.status(400).json({
            success: false,
            message: "Too many files. Maximum 7 images allowed.",
          });
        }
      }

      return res.status(500).json({ success: false, message: "Upload error." });
    }
    next();
  });
};

const editProductUploadMiddleware = (req, res, next) => {
  upload.array("thumbnail", 1)(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large.",
        });
      }

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        if (err.field !== "thumbnail") {
          return res.status(400).json({
            success: false,
            message:
              "Unexpected field. Please use 'thumbnail' as the field name.",
          });
        }

        if (err.field === "thumbnail") {
          return res.status(400).json({
            success: false,
            message: "Too many files. Maximum 1 images allowed.",
          });
        }
      }

      return res.status(500).json({ success: false, message: "Upload error." });
    }
    next();
  });
};

const editProductVariantUploadMiddleware = (req, res, next) => {
  upload.array("images", 7)(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large.",
        });
      }

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        if (err.field !== "images") {
          return res.status(400).json({
            success: false,
            message: "Unexpected field. Please use 'images' as the field name.",
          });
        }

        if (err.field === "images") {
          return res.status(400).json({
            success: false,
            message: "Too many files. Maximum 7 images allowed.",
          });
        }
      }

      return res.status(500).json({ success: false, message: "Upload error." });
    }
    next();
  });
};

/**
 * @route POST /api/v1/products
 * @desc Create a new product (Seller only)
 * @access Private
 * @body { title: String, description: String, amount: String, currency: String thumbnail: File, variantOptions: Stringified JSON [{ name: String, values: [String] }] }
 */
productRouter.post(
  "/",
  authenticateSeller,
  createProductUploadMiddleware,
  createProductValidator,
  createProduct,
);

/**
 * @route POST /api/v1/products/add-variant/:productId
 * @desc Create a new variant for a product (Seller only)
 * @access Private
 * @param {String} productId - ID of the product to add variant to
 * @body { amount: String, currency: String, stock: String, sku: String, isAvailable, images: [Files], attributes: Stringified JSON { key: value } }
 */
productRouter.post(
  "/add-variant/:productId",
  authenticateSeller,
  addVariantUploadMiddleware,
  createProductVariantValidator,
  createProductVariant,
);

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

/**
 * @route GET /api/v1/products
 * @description Get all products
 * @access Public
 */
productRouter.get("/", getAllProducts);

/**
 * @route GET /api/v1/products/:productId
 * @description Get details of a specific product
 * @param {String} productId - ID of the product to fetch details of
 * @access Public
 */
productRouter.get("/:productId", getProductDetails);

/**
 * @route POST /api/v1/product/view/:productId
 * @description Create a view for a product
 * @param {String} productId - ID of product to create view for
 * @access Public
 */
productRouter.post("/view/:productId", optionalAuth, addView);

/**
 * @route PATCH /api/v1/products/:productId
 * @description Edit an existing product owned by the authenticated seller. Successful edits automatically set the product status to "Under Review".
 * @access Private (Seller Only)
 * @param {String} productId - MongoDB ObjectId of the product to edit
 * @body { title: String, description: String, tags: [String], category: String, variantOptions: Stringified JSON [{ name: String, values: [String] }], thumbnail: File }
 */
productRouter.post(
  "/:productId",
  authenticateSeller,
  editProductUploadMiddleware,
  editProductValidator,
  editSellerProduct,
);

/**
 * @route POST /api/v1/products/:productId/variants/:variantId
 * @description Edit an existing product variant owned by the authenticated seller. Successful edits automatically set the parent product status to "Under Review".
 * @access Private (Seller Only)
 * @param {String} productId - MongoDB ObjectId of the parent product, variantId - MongoDB ObjectId of the variant to edit
 * @body { amount: String, currency: String, stock: String, sku: String (CATEGORY-COLOR-SIZE), isAvailable: Boolean, images: [Files], attributes: Stringified JSON { key: value } }
 */
productRouter.post(
  "/:productId/variants/:variantId",
  authenticateSeller,
  editProductVariantUploadMiddleware,
  editProductVariantValidator,
  editProductVariant,
);

/**
 * @route GET /api/v1/products/variants/:variantId
 * @description Get Variant by variant ID
 * @access Public
*/
productRouter.get("/variants/:variantId", getVariant);

export default productRouter;
