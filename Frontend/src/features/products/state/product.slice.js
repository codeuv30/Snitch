import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    sellerProducts: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
  },
});

export const { setProducts, setLoading, setError, setSuccessMessage, setSellerProducts } = productSlice.actions;
export default productSlice.reducer;