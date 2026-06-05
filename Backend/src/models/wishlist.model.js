import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "variants",
        },
        addedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true },
);

const wishlistModel = mongoose.model("wishlist", wishlistSchema);

export default wishlistModel;
