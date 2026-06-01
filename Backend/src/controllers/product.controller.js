import config from "../config/config.js";
import productModel from "../models/product.model.js";
import wishlistModel from "../models/wishlist.model.js";
import { uploadImage } from "../services/storage.services.js";
import viewModel from "../models/views.model.js";

export const createProduct = async (req, res) => {
  const { title, description, amount, currency, tags, category } = req.body;
  const seller = req.user._id;

  try {
    if (!req.files.length) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required.",
      });
    }

    const images = await Promise.all(
      req.files.map(async (file) => {
        return await uploadImage({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      }),
    );

    const product = await productModel.create({
      title,
      description,
      price: {
        amount,
        currency,
      },
      images,
      seller,
      tags,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.log(error.message);
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

    await productModel.findOneAndDelete({ _id: productId, seller });

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
  const products = await productModel.find();

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

  const product = await productModel.findById(productId).populate("seller");

  if (!product) {
    return res.status(400).json({
      success: false,
      message: "Product does not exists",
      show: "404",
    });
  }

  return res.status(200).json({
    success: false,
    message: "Product fetched successfully",
    product,
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
