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
    ]
}, { timestamps: true });

const productModel = mongoose.model("products", productSchema);

export default productModel;