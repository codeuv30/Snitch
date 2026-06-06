import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export const getCartDetails = async (userId) => {
  const cart = await cartModel.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: {
        path: "$items",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "items.product",
      },
    },
    {
      $lookup: {
        from: "variants",
        localField: "items.variant",
        foreignField: "_id",
        as: "items.variant",
      },
    },
    {
      $unwind: {
        path: "$items.product",
      },
    },
    {
      $unwind: {
        path: "$items.variant",
      },
    },
    {
      $addFields: {
        itemPrice: {
          amount: {
            $multiply: ["$items.quantity", "$items.variant.price.amount"],
          },
          currency: "$items.variant.price.currency",
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        totalPrice: {
          $sum: "$itemPrice.amount",
        },
        currency: {
          $first: "$itemPrice.currency",
        },
        items: {
          $push: "$items",
        },
      },
    },
  ]);

  return cart;
};