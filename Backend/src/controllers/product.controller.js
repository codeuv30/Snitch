import config from "../config/config.js";
import productModel from "../models/product.model.js";
import wishlistModel from "../models/wishlist.model.js";
import { uploadImage } from "../services/storage.services.js";
import viewModel from "../models/views.model.js";
import variantsModel from "../models/variants.model.js";
import { createVariantKey } from "../utility/product.utility.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }

  const {
    title,
    description,
    amount,
    currency,
    tags,
    category,
    variantOptions: rawVariantOptions,
  } = req.body;
  const seller = req.user._id;

  let variantOptions;

  try {
    variantOptions = JSON.parse(rawVariantOptions);
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid variant options",
    });
  }

  try {
    const thumbnail = req.files?.[0];

    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    const uploadedThumbnail = await uploadImage({
      fileName: thumbnail.originalname,
      buffer: thumbnail.buffer,
      folder: "snitch/products/thumbnails",
    });

    const thumbnailURL = uploadedThumbnail.url;

    const product = await productModel.create({
      title,
      description,
      seller,
      category,
      tags,
      variantOptions,
      thumbnail: thumbnailURL,
      startingPrice: {
        amount,
        currency,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `We were unable to create the product at this time. Please try again later. If the problem continues, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const createProductVariant = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }

  const productId = req.params?.productId;

  const {
    amount,
    currency,
    stock,
    sku,
    isAvailable,
    attributes: rawAttributes,
  } = req.body;

  const images = req.files;

  let attributes;

  try {
    attributes = JSON.parse(rawAttributes);
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid attributes",
    });
  }

  try {
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "ProductId is required",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product does not exists",
        show: "404",
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to add variants to this product",
      });
    }

    if (product.status === "Under Review") {
      return res.status(400).json({
        success: false,
        message: "The product is under review.",
      });
    }

    const allowedOptions = product.variantOptions.map((option) => option.name);

    const attributeKeys = Object.keys(attributes);

    const invalidAttributes = attributeKeys.filter(
      (key) => !allowedOptions.includes(key),
    );

    const requiredOptions = product.variantOptions.map((option) => option.name);

    const missingOptions = requiredOptions.filter(
      (option) => !(option in attributes),
    );

    if (missingOptions.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing attributes: ${missingOptions.join(", ")}`,
      });
    }

    if (invalidAttributes.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid attributes: ${invalidAttributes.join(", ")}`,
      });
    }

    for (const option of product.variantOptions) {
      const value = attributes[option.name];

      if (value && !option.values.includes(value)) {
        return res.status(400).json({
          success: false,
          message: `Invalid value "${value}" for ${option.name}`,
        });
      }
    }

    const variantKey = createVariantKey(attributes);

    const existingVariant = await variantsModel.findOne({
      product: product._id,
      variantKey,
    });

    if (existingVariant) {
      return res.status(400).json({
        success: false,
        message: "Variant with the same attributes already exists",
      });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required for the product variant",
      });
    }

    const imageUpload = await Promise.all(
      images.map(async (image) => {
        return uploadImage({
          fileName: image.originalname,
          buffer: image.buffer,
          folder: "snitch/products/variants",
        });
      }),
    );

    const urls = imageUpload.map((upload) => upload.url);

    const variantData = {
      product: productId,
      sku,
      attributes,
      price: {
        amount,
        currency,
      },
      stock,
      images: urls.map((url) => ({ url })),
      isAvailable,
      variantKey,
    };

    const variant = await variantsModel.create(variantData);

    if (amount < product.startingPrice.amount) {
      product.startingPrice.amount = amount;
    }

    product.status = "Live";
    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product variant created successfully",
      variant,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: `We were unable to create the product variant at this time. Please try again later. If the problem continues, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const getSellerProducts = async (req, res) => {
  const seller = req.user._id;

  try {
    const products = await productModel.find({ seller });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to fetch your products at this time. Please try again later. If the problem continues, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params?.productId;
    const seller = req.user._id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "ProductId is required",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product does not exists",
        show: "404",
      });
    }

    if (product.seller.toString() !== seller.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this product",
      });
    }

    await productModel.findOneAndDelete({ _id: productId, seller });
    await variantsModel.deleteMany({ product: productId });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to delete the product at this time. Please try again later. If the problem continues, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const getAllProducts = async (req, res) => {
  const products = await productModel.find({ status: "Live" });

  return res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products,
  });
};

export const getProductDetails = async (req, res) => {
  const productId = req.params?.productId;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "ProductId is required",
    });
  }

  const product = await productModel
    .findOne({ _id: productId, status: "Live" })
    .populate("seller");

  if (!product) {
    return res.status(400).json({
      success: false,
      message: "Product does not exists",
      show: "404",
    });
  }

  const variants = await variantsModel.find({ product: product._id });

  return res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    product,
    variants,
  });
};

export const addView = async (req, res) => {
  const productId = req.params?.productId;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "ProductId is required",
    });
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return res.status(400).json({
      success: false,
      message: "Product does not exists",
      show: "404",
    });
  }

  const existingView = await viewModel.findOne({
    product: product._id,
    viewedBy: req.user?._id,
  });

  if (existingView) {
    return res.status(200).json({
      success: true,
      message: "View added successfully",
    });
  }

  const viewData = {
    product: product._id,
  };

  if (req.user) {
    viewData.viewedBy = req.user._id;
  } else {
    viewData.sessionId = req.visitorId;
  }

  const view = await viewModel.create(viewData);

  await productModel.findByIdAndUpdate(product._id, { $inc: { views: 1 } });

  return res.status(200).json({
    success: true,
    message: "View added successfully",
  });
};

export const editSellerProduct = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }

  const productId = req.params?.productId;
  const seller = req.user._id;

  const title = req.body.title;
  const description = req.body.description;
  const tags = req.body.tags;
  const category = req.body.category;

  let variantOptions;

  try {
    variantOptions = req.body.variantOptions
      ? JSON.parse(req.body.variantOptions)
      : undefined;
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid variantOptions format",
    });
  }

  const thumbnail = req.files[0];

  const newProductData = {
    status: "Under Review",
  };

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ProductId",
    });
  }

  if (title) {
    newProductData.title = title;
  }

  if (description) {
    newProductData.description = description;
  }

  if (tags) {
    newProductData.tags = tags;
  }

  if (category) {
    newProductData.category = category;
  }

  if (variantOptions) {
    newProductData.variantOptions = variantOptions;
  }

  if (thumbnail) {
    const image = await uploadImage({
      fileName: thumbnail.originalname,
      buffer: thumbnail.buffer,
      folder: "snitch/products/thumbnails",
    });
    newProductData.thumbnail = image.url;
  }

  const existingProduct = await productModel.findOne({
    _id: productId,
    seller,
  });

  if (!existingProduct) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  if (existingProduct.status === "Under Review") {
    return res.status(403).json({
      success: false,
      message: "Products under review cannot be edited",
    });
  }

  if (existingProduct.seller.toString() !== seller.toString()) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action.",
    });
  }

  const product = await productModel.findByIdAndUpdate(
    productId,
    { $set: newProductData },
    {
      returnDocument: "after",
    },
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found or you do not own it",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Product updated successfully, now going under review",
  });
};

export const editProductVariant = async (req, res) => {
  const { productId, variantId } = req.params;
  const seller = req.user._id;

  const images = req.files;

  let existingImages;

  if (req.body.existingImages) {
    try {
      existingImages = req.body.existingImages
        ? JSON.parse(req.body.existingImages)
        : undefined;
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid existingImages format",
      });
    }
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid productId",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(variantId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid variantId",
    });
  }

  const product = await productModel.findOne({
    _id: productId,
    seller,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  if (product.status === "Under Review") {
    return res.status(403).json({
      success: false,
      message: "Variants of products under review cannot be edited",
    });
  }

  const updateData = {};

  if (req.body.sku) {
    updateData.sku = req.body.sku.toUpperCase();
  }

  if (req.body.attributes) {
    updateData.attributes =
      typeof req.body.attributes === "string"
        ? JSON.parse(req.body.attributes)
        : req.body.attributes;
  }

  if (req.body.amount) {
    updateData["price.amount"] = Number(req.body.amount);
  }

  if (req.body.currency) {
    updateData["price.currency"] = req.body.currency;
  }

  if (req.body.stock !== undefined) {
    updateData.stock = Number(req.body.stock);
  }

  if (req.body.isAvailable !== undefined) {
    updateData.isAvailable =
      req.body.isAvailable === true || req.body.isAvailable === "true";
  }

  if (images && existingImages) {
    const uploadImages = await Promise.all(
      images.map((image) => {
        return uploadImage({
          fileName: image.originalname,
          buffer: image.buffer,
          folder: "/snitch/products/variants",
        });
      }),
    );

    const imageUrls = uploadImages.map((img) => img.url);

    const newImageData = imageUrls.map((url) => ({
      url,
    }));

    const oldImageData = existingImages.map((url) => ({
      url,
    }));

    const finalImages = [...oldImageData, ...newImageData]

    if(finalImages.length > 7) {
      return res.status(400).json({
        success: false,
        message: "You can only upload 7 images"
      })
    }

    updateData.images = finalImages;
  }

  const variant = await variantsModel.findOneAndUpdate(
    {
      _id: variantId,
      product: productId,
    },
    {
      $set: updateData,
    },
    {
      returnDocument: "after",
    },
  );

  if (!variant) {
    return res.status(404).json({
      success: false,
      message: "Variant not found",
    });
  }

  // Product goes back for review after variant change
  product.status = "Under Review";
  await product.save();

  return res.status(200).json({
    success: true,
    message: "Variant updated successfully, now going under review",
  });
};

export const getVariant = async (req, res) => {
  const { variantId } = req.params;

  if (!variantId) {
    return res.status(400).json({
      success: false,
      message: "Variant ID is required",
    });
  }

  const variant = await variantsModel.findOne({ _id: variantId });

  if (!variant) {
    return res.status(400).json({
      success: false,
      message: "Variant does not exists",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Variant fetched successfully",
    variant,
  });
};
