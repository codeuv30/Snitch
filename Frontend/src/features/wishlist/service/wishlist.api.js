import axios from "axios";
import { setError, setLoading, setSuccessMessage } from "../state/wishlist.slice";

const baseURL = "/api/v1/wishlist";

const wishlistApiInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const addItem = async (productId, variantId, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await wishlistApiInstance.post(
      `/add/${productId}/${variantId}`,
    );

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

export const removeItem = async (productId, variantId, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await wishlistApiInstance.post(
      `/remove/${productId}/${variantId}`,
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

export const getWishlist = async (dispatch) => {
  try {

    dispatch(setLoading(true));

    const response = await wishlistApiInstance.get("/");

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
