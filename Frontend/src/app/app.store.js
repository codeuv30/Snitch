import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice";
import productReducer from "../features/products/state/product.slice";
import cartReducer from "../features/cart/state/cart.slice.js";
import wishlistReducer from "../features/wishlist/state/wishlist.slice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer
    }
});