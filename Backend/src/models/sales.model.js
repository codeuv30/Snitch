import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true
  },
  soldAt: {
    type: Date,
    default: Date.now()
  }
}, { timestamps: true });

const salesModel = mongoose.model("sales", salesSchema);

export default salesSchema;