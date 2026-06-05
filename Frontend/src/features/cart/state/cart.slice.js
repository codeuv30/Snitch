import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: true,
        error: null,
        successMessage: null
    },
    reducers: {
        setItems: function (state, action) {
            state.items = action.payload;
        },
        addItem: function (state, action) {
            state.items.push(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
        }
    }
});

export const { setItems, addItem, setLoading, setError, setSuccessMessage } = cartSlice.actions;
export default cartSlice.reducer