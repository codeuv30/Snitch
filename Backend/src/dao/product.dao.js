import productModel from "../models/product.model.js";
import variantsModel from "../models/variants.model.js";

export const stockOfVariant = async (productId, variantId) => {
    const product = await productModel.findOne({
        _id: productId,
        status: "Live"
    });

    const variant = await variantsModel.findOne({ _id: variantId, product: product._id });

    const stock = variant.stock;

    return stock;   
}