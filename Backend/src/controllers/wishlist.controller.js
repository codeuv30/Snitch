import wishlistModel from "../models/wishlist.model.js";
import variantsModel from "../models/variants.model.js";
import productModel from "../models/product.model.js";
import config from "../config/config.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const user = req.user;

    const product = await productModel.findOne({ _id: productId });

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product does not exists",
      });
    }

    const variant = await variantsModel.findOne({
      _id: variantId,
      product: product._id,
    });

    if (!variant) {
      return res.status(400).json({
        success: false,
        message: "Variant does not exists",
      });
    }

    let wishlist = await wishlistModel.findOne({ user: user._id });

    if (!wishlist) {
      wishlist = await wishlistModel.create({ user: user._id });
    }

    const isProductAlreadyInWishlist = wishlist.products.some(
      (item) =>
        item.product.toString() === product._id.toString() &&
        item.variant.toString() === variant._id.toString(),
    );

    if (isProductAlreadyInWishlist) {
      return res.status(400).json({
        success: false,
        message: "Product is already in the wishlist",
      });
    }

    wishlist.products.push({
      product: product._id,
      variant: variant._id,
      price: variant.price,
    });

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Successfully added product to wishlist",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to add the product in the wishlist at this time. Please try again later. If the problem persists, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = req.user;

    let wishlist = await wishlistModel.findOne({ user: user._id }).populate("products.product").populate("products.variant");

    if (!wishlist) {
      wishlist = await wishlistModel.create({ user: user._id });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully fetched wishlist",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to fetch your wishlist at this time. Please try again later. If the problem persists, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const removeItemFromWishlist = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const user = req.user;

    const wishlist = await wishlistModel.findOne({ user: user._id });

    if (!wishlist) {
      return res.status(400).json({
        message: "Please create a wishlist first",
        success: false,
      });
    }

    const product = await productModel.findOne({
      _id: productId,
      status: "Live",
    });

    if (!product) {
      return res.status(400).json({
        message: "Product does not exists",
        success: false,
      });
    }

    const variant = await variantsModel.findOne({
      _id: variantId,
      product: product._id,
    });

    if (!variant) {
      return res.status(400).json({
        message: "Variant does not exists",
        success: false,
      });
    }

    const hasItemInWishlist = wishlist.products.some(
      (item) =>
        item.product.toString() === product._id.toString() &&
        item.variant.toString() === variant._id.toString(),
    );

    if (!hasItemInWishlist) {
      return res.status(400).json({
        success: false,
        message: "Please add the product in wishlist first",
      });
    }

    await wishlistModel.updateOne(
      { user: user._id },
      {
        $pull: {
          products: {
            product: product._id,
            variant: variant._id,
          },
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Successfully removed product from wishlist",
      wishlist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to remove item from your wishlist at this time. Please try again later. If the problem persists, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};
