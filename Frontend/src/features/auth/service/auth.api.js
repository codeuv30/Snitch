import axios from "axios";
import {
  setError,
  setLoading,
  setSuccessMessage,
  setInitialized,
  setUser,
} from "../state/auth.slice.js";

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/auth";

const authApiInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

export const getCurrentUser = async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await authApiInstance.get("/me");
    const userData = response.data?.user || null;

    dispatch(setUser(userData));

    return userData;
  } catch (error) {
    // 401 = not logged in. This is expected, NOT an error.
    if (error.response?.status === 401) {
      dispatch(setUser(null));
      return null;
    }

    // Real errors (500, network down, CORS, etc.)
    const message =
      error.response?.data?.message ||
      "Failed to fetch current user. Please try again.";
    dispatch(setError(message));
    return null;
  } finally {
    // Only mark initialized AFTER user state is settled
    dispatch(setLoading(false));
    dispatch(setInitialized(true));
  }
};

export const register = async (user, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await authApiInstance.post("/register", user);

    dispatch(setSuccessMessage(response.data.message));

    return response.data;
  } catch (error) {
    console.log(error);
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

export const login = async ({ email, password }, dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await authApiInstance.post("/login", {
      email,
      password,
    });

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

export const logout = async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await authApiInstance.get("/logout");

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
