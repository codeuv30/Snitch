import mongoose from "mongoose";

const viewsSchema = new mongoose.Schema({
    viewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
    },
    sessionId: {
        type: String,
        default: null
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    viewedAt: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });

const viewModel = mongoose.model("views", viewsSchema);

export default viewModel;