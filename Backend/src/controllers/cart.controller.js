import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import variantModel from "../models/variants.model.js";
import config from "../config/config.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const user = req.user;

    const product = await productModel.findOne({ _id: productId, status: "Live" });
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product does not exists",
      });
    }
    const variant = await variantModel.findOne({
      _id: variantId,
      product: product._id,
    });

    if (!variant) {
      return res.status(400).json({
        success: false,
        message: "Variant does not exists",
      });
    }

    if (variant.stock <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "This variant is not currently in stock you can check again later",
      });
    }

    let cart = await cartModel.findOne({ user: user._id });

    /* Create a cart only if user don't have a cart */
    if (!cart) {
      cart = await cartModel.create({
        user: user._id,
      });
    }

    const isProductAlreadyInCart = cart.items.some(
      (item) =>
        item.product.toString() === product._id.toString() &&
        item.variant.toString() === variant._id.toString(),
    );

    if (isProductAlreadyInCart) {
      return res.status(400).json({
        success: false,
        message: "Product is already in the cart",
      });
    }

    cart.items.push({
      product: product._id,
      variant: variant._id,
      quantity: 1,
      price: variant.price,
    });

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Successfully added product to cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to add the product in the cart at this time. Please try again later. If the problem persists, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const incrementQuantity = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const user = req.user;

    const cart = await cartModel.findOne({ user: user._id });

    if (!cart) {
      return res.status(400).json({
        message: "Please create a cart first",
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

    const variant = await variantModel.findOne({
      _id: variantId,
      product: product._id,
    });

    if (!variant) {
      return res.status(400).json({
        message: "Variant does not exists",
        success: false,
      });
    }

    const stockThreshold = 0;

    if (variant.stock <= stockThreshold) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock} items available in stock`,
      });
    }

    const hasItemInCart = cart.items.some(
      (item) =>
        item.product.toString() === product._id.toString() &&
        item.variant.toString() === variant._id.toString(),
    );

    if (!hasItemInCart) {
      return res.status(400).json({
        success: false,
        message: "Please add the product in cart first",
      });
    }

    const cartItem = cart.items.find(
      (item) =>
        item.product.toString() === product._id.toString() &&
        item.variant.toString() === variant._id.toString(),
    );

    if (cartItem.quantity >= variant.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock} units available`,
      });
    }

    await cartModel.updateOne(
      {
        user: user._id,
        "items.product": product._id,
        "items.variant": variant._id,
      },
      {
        $inc: {
          "items.$.quantity": 1,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Successfully incremented the product quantity in your cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to increment product quantity in your cart at this time. Please try again later. If the problem persists, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const decrementQuantity = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const user = req.user;

    const cart = await cartModel.findOne({ user: user._id });

    if (!cart) {
      return res.status(400).json({
        message: "Please create a cart first",
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

    const variant = await variantModel.findOne({
      _id: variantId,
      product: product._id,
    });

    if (!variant) {
      return res.status(400).json({
        message: "Variant does not exists",
        success: false,
      });
    }

    const hasItemInCart = cart.items.some(
      (item) =>
        item.product.toString() === product._id.toString() &&
        item.variant.toString() === variant._id.toString(),
    );

    if (!hasItemInCart) {
      return res.status(400).json({
        success: false,
        message: "Please add the product in cart first",
      });
    }

    const cartItem = cart.items.find(
      (item) =>
        item.product.toString() === product._id.toString() &&
        item.variant.toString() === variant._id.toString(),
    );

    if (cartItem.quantity <= 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be less than 1",
      });
    }

    await cartModel.updateOne(
      {
        user: user._id,
        "items.product": product._id,
        "items.variant": variant._id,
      },
      {
        $inc: {
          "items.$.quantity": -1,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Successfully decremented the product quantity in your cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to decrement product quantity in your cart at this time. Please try again later. If the problem persists, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = req.user;

    let cart = await cartModel
      .findOne({ user: user._id })
      .populate("items.product")
      .populate("items.variant");

    /* Create a cart only if user don't have a cart */
    if (!cart) {
      cart = await cartModel.create({
        user: user._id,
      });
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to find your cart items at this time. Please try again later. If the problem persists, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const user = req.user;

    const cart = await cartModel.findOne({ user: user._id });

    if (!cart) {
      return res.status(400).json({
        message: "Please create a cart first",
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

    const variant = await variantModel.findOne({
      _id: variantId,
      product: product._id,
    });

    if (!variant) {
      return res.status(400).json({
        message: "Variant does not exists",
        success: false,
      });
    }

    const hasItemInCart = cart.items.some(
      (item) =>
        item.product.toString() === product._id.toString() &&
        item.variant.toString() === variant._id.toString(),
    );

    if (!hasItemInCart) {
      return res.status(400).json({
        success: false,
        message: "Please add the product in cart first",
      });
    }

    await cartModel.updateOne(
      { user: user._id },
      {
        $pull: {
          items: {
            product: product._id,
            variant: variant._id,
          },
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to remove this item from your cart at this time. Please try again later. If the problem persists, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};
