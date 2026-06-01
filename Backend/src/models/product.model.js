import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    price: {
        amount: {
            type: String,
            required: true,
        },
        currency: {
            type: String,
            enum: ["INR", "EUR", "GBP", "JPY", "USD"],
            default: "INR",
            required: true,
        }
    },
    images: [
        {
            url: {
                type: String,
                required: true,
            }
        }
    ],
    views: {
        type: Number,
        default: 0,
    },
    sales: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [String],
        enum: [
            "men", "women", "shirts", "t-shirts", "jeans",
            "trousers", "blazers", "footwear", "accessories", "ethnic",
            "tops", "dresses", "outerwear", "bottoms",
        ],
        default: [],
    },
    category: {
        type: String,
        enum: [
            "men", "women", "unisex",
            "shirts", "t-shirts", "jeans", "trousers",
            "blazers", "footwear", "accessories", "ethnic",
            "tops", "dresses", "outerwear", "bottoms",
        ],
        default: null,
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
        default: 50, // mark as bestseller after 50 sales
    },
}, { timestamps: true });

productSchema.virtual("isNew").get(function () {
  const fourteenDays = 14 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(this.publishedAt).getTime() < fourteenDays;
});

productSchema.virtual("autoIsBestseller").get(function () {
  return this.sales >= this.bestsellerThreshold;
});

productSchema.set("toJSON",   { virtuals: true });
productSchema.set("toObject", { virtuals: true });

productSchema.index({ tags: 1 });
productSchema.index({ category: 1 });
productSchema.index({ sales: -1 });
productSchema.index({ publishedAt: -1 });

const productModel = mongoose.model("products", productSchema);

export default productModel;