import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        error: null,
        loading: false,
        successMessage: null,
        products: [],
    },
    reducers: {
        setError: (state, action) => {
            state.error = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        }
    }
});

export const { setError, setLoading, setSuccessMessage, setProducts } = wishlistSlice.actions;
export default wishlistSlice.reducer;