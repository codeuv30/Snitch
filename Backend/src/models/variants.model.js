import mongoose from "mongoose";

const variantsSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
      index: true,
    },
    variantKey: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    attributes: {
      type: Map,
      of: String,
    },
    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        enum: ["INR", "USD", "EUR", "GBP", "JPY"],
        default: "INR",
      },
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

variantsSchema.index({ sku: 1 });
variantsSchema.index(
  {
    product: 1,
    variantKey: 1,
  },
  {
    unique: true,
  },
);

const variantsModel = mongoose.model("variants", variantsSchema);

export default variantsModel;
