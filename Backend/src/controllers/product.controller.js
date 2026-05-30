import config from "../config/config.js";
import productModel from "../models/product.model.js";
import { uploadImage } from "../services/storage.services.js";

export const createProduct = async (req, res) => {
  const { title, description, amount, currency } = req.body;
  const seller = req.user._id;

  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

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
