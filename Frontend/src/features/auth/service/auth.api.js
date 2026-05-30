import axios from "axios";
import {
  setError,
  setLoading,
  setSuccessMessage,
} from "../state/auth.slice.js";

const BASE_API_URL = "/api/v1/auth";

const authApiInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

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

    dispatch(setError("An unexpected error occurred. Please try again."));
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
