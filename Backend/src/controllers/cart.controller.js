import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import variantModel from "../models/variants.model.js";
import paymentModel from "../models/payment.model.js";
import config from "../config/config.js";
import mongoose from "mongoose";
import { createOrder } from "../services/payment.services.js";
import { getCartDetails } from "../dao/cart.dao.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const user = req.user;

    const product = await productModel.findOne({
      _id: productId,
      status: "Live",
    });

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

    let cart = await getCartDetails(user._id);

    /* Create a cart only if user don't have a cart */
    if (cart.length === 0) {
      const existingCart = await cartModel.findOne({
        user: user._id,
      });

      if (!existingCart) {
        await cartModel.create({
          user: user._id,
        });
      }

      cart = await getCartDetails(user._id);
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

export const createOrderController = async (req, res) => {
  try {
    const cartArray = await getCartDetails(req.user._id);

    const cart = cartArray[0];

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const order = await createOrder({
      amount: cart.totalPrice,
      currency: cart.currency,
    });

    const orderItems = cart.items.map((item) => ({
      title: item.product.title,
      productId: item.product._id,
      variantId: item.variant._id,
      quantity: item.quantity,
      images: item.variant.images,
      description: item.product.description,
      price: {
        amount: item.variant.price.amount,
        currency: item.variant.price.currency,
      },
    }));

    const payment = await paymentModel.create({
      user: req.user._id,
      razorpay: {
        orderId: order.id,
      },
      price: {
        amount: cart.totalPrice,
        currency: cart.currency,
      },
      orderItems,
    });

    return res.status(200).json({
      message: "Order placed successfully",
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to make payment at this time. Please try again later. If the problem persists, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};

export const verifyOrderController = async (req, res) => {
  try {
    const user = req.user;

    const razorpay_order_id = req.body.razorpay_order_id;
    const razorpay_payment_id = req.body.razorpay_payment_id;
    const razorpay_signature = req.body.razorpay_signature;

    if (!razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay OrderId is required",
      });
    }

    if (!razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay PaymentId is required",
      });
    }

    if (!razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Razorpay signature is required",
      });
    }

    const payment = await paymentModel.findOne({
      "razorpay.orderId": razorpay_order_id,
      status: "pending",
    });

    if (!payment) {
      return res.status(400).json({
        message: "payment not found",
        success: false,
      });
    }

    const isPaymentValid = validatePaymentVerification(
      {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      },
      razorpay_signature,
      config.RAZORPAY_KEY_SECRET,
    );

    if (!isPaymentValid) {
      payment.status = "failed";
      await payment.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    payment.status = "paid";

    payment.razorpay.paymentId = razorpay_payment_id;
    payment.razorpay.signature = razorpay_signature;

    await payment.save();

    return res.status(200).json({
      success: false,
      message: "Payment verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `We were unable to verify your payment at this time. Please try again later. If the problem persists, please contact support through ${
        config.NODE_ENV === "production"
          ? config.FRONTEND_PRODUCTION_URL
          : config.FRONTEND_DEVELOPMENT_URL
      }/report-issue.`,
    });
  }
};