import axios from "axios";
import { setError, setLoading, setSuccessMessage } from "../state/cart.slice.js";

const baseURL = "/api/v1/cart";

const cartApiInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const addItem = async (productId, variantId, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await cartApiInstance.post(
      `/add/${productId}/${variantId}`,
    );

    dispatch(setSuccessMessage(response.data.message))

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

export const getCart = async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await cartApiInstance.get("/");

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

export const incrementCartItem = async (productId, variantId, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await cartApiInstance.post(
      `/increment/${productId}/${variantId}`,
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

export const decrementCartItem = async (productId, variantId, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await cartApiInstance.post(
      `/decrement/${productId}/${variantId}`,
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

export const removeItem = async (productId, variantId, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await cartApiInstance.post(`/remove/${productId}/${variantId}`);

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
