import axios from "axios";
import {
  setError,
  setLoading,
  setSuccessMessage,
} from "../state/product.slice";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/products";

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

export const addVariant = async (productId, formData, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await productApiInstance.post(
      `/add-variant/${productId}`,
      formData,
    );

    dispatch(setSuccessMessage(response.data.message));
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(setError(error.response.data.message));
      return null;
    }

    console.error(error);

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
};

export const editProduct = async (formData, productId, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await productApiInstance.post(`/${productId}`, formData);

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

export const getVariant = async (variantId, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await productApiInstance.get(`/variants/${variantId}`);

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

export const editProductVariant = async (
  productId,
  variantId,
  formData,
  dispatch,
) => {
  try {
    dispatch(setLoading(true));

    const response = await productApiInstance.post(
      `${productId}/variants/${variantId}`,
      formData,
    );

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
