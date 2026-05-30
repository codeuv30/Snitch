import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    initialized: false, // For checking if we have already fetched the user on app load
    error: null,
    successMessage: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
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
    setInitialized: (state, action) => {
      state.initialized = action.payload;
    },
  },
});

export const { setUser, setLoading, setError, setSuccessMessage, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;
