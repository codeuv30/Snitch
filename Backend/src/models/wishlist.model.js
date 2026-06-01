import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now()
  },
}, { timestamps: true });

const wishlistModel = mongoose.model("wishlist", wishlistSchema);

export default wishlistModel;
