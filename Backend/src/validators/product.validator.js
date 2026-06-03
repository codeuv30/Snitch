import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  next();
}

export const createProductValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),
  body("currency")
    .notEmpty()
    .withMessage("Currency is required")
    .isIn(["INR", "EUR", "GBP", "JPY", "USD"])
    .withMessage(
      "Currency must be one of the following: INR, EUR, GBP, JPY, USD",
    ),
  body("tags")
    .notEmpty()
    .withMessage("Tags are required")
    .isArray()
    .withMessage("Tags must be an array of strings"),
  body("variantOptions").custom((value) => {
    let parsed;

    try {
      parsed = JSON.parse(value);
    } catch {
      throw new Error("Variant options must be valid JSON.");
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Variant options must be a non-empty array.");
    }

    for (const option of parsed) {
      if (!option.name) {
        throw new Error("Each variant option requires a name.");
      }

      if (!Array.isArray(option.values) || option.values.length === 0) {
        throw new Error(`Variant option "${option.name}" must have values.`);
      }
    }

    return true;
  }),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "men",
      "women",
      "shirts",
      "t-shirts",
      "jeans",
      "trousers",
      "blazers",
      "footwear",
      "accessories",
      "ethnic",
      "tops",
      "dresses",
      "outerwear",
      "bottoms",
    ])
    .withMessage(
      "Category must be one of the following: men, women, shirts, t-shirts, jeans, trousers, blazers, footwear, accessories, ethnic, tops, dresses, outerwear, bottoms",
    ),
  validateRequest,
];

export const createProductVariantValidator = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required.")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number."),

  body("currency")
    .trim()
    .notEmpty()
    .withMessage("Currency is required.")
    .isIn(["INR", "USD", "EUR", "GBP", "JPY"])
    .withMessage(
      "Currency must be one of the following: INR, USD, EUR, GBP, JPY.",
    ),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),

  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required.")
    .custom((value) => {
      const parts = value.split("-");

      if (parts.length < 3) {
        throw new Error("SKU must follow format CATEGORY-COLOR-SIZE");
      }

      return true;
    }),

  body("isAvailable")
    .notEmpty()
    .withMessage("isAvailable is required.")
    .isBoolean()
    .withMessage("isAvailable must be a boolean value."),

  body("attributes")
    .notEmpty()
    .withMessage("Attributes are required.")
    .custom((value) => {
      let parsed;

      try {
        parsed = JSON.parse(value);
      } catch {
        throw new Error("Attributes must be valid JSON.");
      }

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed) ||
        Object.keys(parsed).length === 0
      ) {
        throw new Error("Attributes must contain at least one key/value pair.");
      }

      for (const [key, val] of Object.entries(parsed)) {
        if (
          typeof key !== "string" ||
          !key.trim() ||
          typeof val !== "string" ||
          !val.trim()
        ) {
          throw new Error(
            "All attribute keys and values must be non-empty strings.",
          );
        }
      }

      return true;
    }),

  validateRequest,
];

export const editProductValidator = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),

  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),

  body("variantOptions")
    .optional()
    .custom((value) => {
      let parsed;

      try {
        parsed = JSON.parse(value);
      } catch {
        throw new Error("Variant options must be valid JSON.");
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Variant options must be a non-empty array.");
      }

      for (const option of parsed) {
        if (!option.name) {
          throw new Error("Each variant option requires a name.");
        }

        if (!Array.isArray(option.values) || option.values.length === 0) {
          throw new Error(`Variant option "${option.name}" must have values.`);
        }
      }

      return true;
    }),

  body("category")
    .optional()
    .isIn([
      "men",
      "women",
      "shirts",
      "t-shirts",
      "jeans",
      "trousers",
      "blazers",
      "footwear",
      "accessories",
      "ethnic",
      "tops",
      "dresses",
      "outerwear",
      "bottoms",
    ])
    .withMessage("Category must be one of the allowed categories"),

  body().custom((_, { req }) => {
    const hasUpdateField =
      req.body?.title !== undefined ||
      req.body?.description !== undefined ||
      req.body?.tags !== undefined ||
      req.body?.variantOptions !== undefined ||
      req.body?.category !== undefined ||
      (req.files?.thumbnail && req.files.thumbnail.length > 0);

    if (!hasUpdateField) {
      throw new Error("At least one field must be provided for update.");
    }

    return true;
  }),

  validateRequest,
];

export const editProductVariantValidator = [
  body("sku")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("SKU cannot be empty.")
    .custom((value) => {
      const parts = value.split("-");

      if (parts.length < 3) {
        throw new Error("SKU must follow format CATEGORY-COLOR-SIZE");
      }

      return true;
    }),

  body("attributes")
    .optional()
    .custom((value) => {
      let parsed;

      try {
        parsed = typeof value === "string" ? JSON.parse(value) : value;
      } catch {
        throw new Error("Attributes must be valid JSON.");
      }

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed) ||
        Object.keys(parsed).length === 0
      ) {
        throw new Error("Attributes must contain at least one key/value pair.");
      }

      for (const [key, val] of Object.entries(parsed)) {
        if (
          typeof key !== "string" ||
          !key.trim() ||
          typeof val !== "string" ||
          !val.trim()
        ) {
          throw new Error(
            "All attribute keys and values must be non-empty strings.",
          );
        }
      }

      return true;
    }),

  body("amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),

  body("currency")
    .optional()
    .isIn(["INR", "USD", "EUR", "GBP", "JPY"])
    .withMessage("Currency must be one of: INR, USD, EUR, GBP, JPY"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative"),

  body("isAvailable")
    .optional()
    .isBoolean()
    .withMessage("isAvailable must be a boolean"),

  body().custom((_, { req }) => {
    const hasUpdateField =
      req.body?.sku !== undefined ||
      req.body?.attributes !== undefined ||
      req.body?.amount !== undefined ||
      req.body?.currency !== undefined ||
      req.body?.stock !== undefined ||
      req.body?.isAvailable !== undefined ||
      (req.files && req.files.length > 0);

    if (!hasUpdateField) {
      throw new Error("At least one field must be provided for update.");
    }

    return true;
  }),

  validateRequest,
];