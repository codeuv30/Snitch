import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      enum: ["Live", "Draft", "Under Review"],
      default: "Under Review",
    },
    category: {
      type: String,
      enum: [
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
      ],
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    bestsellerThreshold: {
      type: Number,
      default: 50,
    },
    variantOptions: [
      {
        name: {
          type: String,
          required: true,
        },
        values: [String],
      },
    ],
    thumbnail: {
      type: String,
      required: true,
    },
    startingPrice: {
      type: priceSchema,
      required: true
    },
  },
  {
    timestamps: true,
  },
);

productSchema.virtual("isNew").get(function () {
  const fourteenDays = 14 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(this.publishedAt).getTime() < fourteenDays;
});

productSchema.virtual("autoIsBestseller").get(function () {
  return this.sales >= this.bestsellerThreshold;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ sales: -1 });
productSchema.index({ publishedAt: -1 });

const productModel = mongoose.model("products", productSchema);

export default productModel;
