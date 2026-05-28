import axios from "axios";
import {
  setError,
  setLoading,
  setSuccessMessage,
} from "../state/auth.slice.js";

const BASE_API_URL = "http://localhost:3000/api/v1/auth";

const authApiInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

export const register = async (
  { email, contact, password, fullName, isSeller },
  dispatch,
) => {
  try {
    dispatch(setLoading(true));

    const response = await authApiInstance.post("/register", {
      email,
      contact,
      password,
      fullName,
      isSeller,
    });

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
