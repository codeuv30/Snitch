import axios from "axios";
import {
  setError,
  setLoading,
  setSuccessMessage,
} from "../state/product.slice";

const API_BASE_URL = "/api/v1/products";

const productApiInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const createProduct = async (formData, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await productApiInstance.post("/", formData);

    dispatch(setSuccessMessage(response.data.message));
    return response.data;
  } catch (err) {
    if (err.response && err.response.data) {
      dispatch(setError(err.response.data.message));
      return null;
    }

    console.error(err);
    dispatch(
      setError(
        `An unexpected error occurred. Please try again later. If the issue persists, please contact support through ${import.meta.env.VITE_FRONTEND_URL}`,
      ),
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchSellerProducts = async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await productApiInstance.get("/seller");

    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(setError(error.response.data.message));
      return null;
    }

    dispatch(
      setError(
        `An unexpected error occurred. Please try again later. If the issue persists, please contact support through ${import.meta.env.VITE_FRONTEND_URL}`,
      ),
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteProduct = async (productId, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await productApiInstance.get(`/delete/${productId}`);

    dispatch(setSuccessMessage(response.data.message));

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(setError(error.response.data.message));
      return null;
    }

    dispatch(
      setError(
        `An unexpected error occurred. Please try again later. If the issue persists, please contact support through ${import.meta.env.VITE_FRONTEND_URL}`,
      ),
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const getAllProducts = async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await productApiInstance.get("/");

    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(setError(error.response.data.message));
      return null;
    }

    dispatch(
      setError(
        `An unexpected error occurred. Please try again later. If the issue persists, please contact support through ${import.meta.env.VITE_FRONTEND_URL}`,
      ),
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const getProductDetails = async (productId, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await productApiInstance.get(`/${productId}`);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(setError(error.response.data.message));
      return null;
    }

    dispatch(
      setError(
        `An unexpected error occurred. Please try again later. If the issue persists, please contact support through ${import.meta.env.VITE_FRONTEND_URL}`,
      ),
    );
  } finally {
    setLoading(false);
  }
};

export const createView = async (productId, dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await productApiInstance.post(`/view/${productId}/`);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(setError(error.response.data.message));
      return null;
    }

    dispatch(
      setError(
        `An unexpected error occurred. Please try again later. If the issue persists, please contact support through ${import.meta.env.VITE_FRONTEND_URL}`,
      ),
    );
  } finally {
    dispatch(setLoading(true));
  }
}