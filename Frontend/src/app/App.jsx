import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useDispatch, useSelector } from "react-redux";
import {
  setSuccessMessage as setAuthSuccessMessage,
} from "../features/auth/state/auth.slice.js";
import { setSuccessMessage as setProductSuccessMessage } from "../features/products/state/product.slice.js";
import Toast from "@/components/ui/Toast.js";
import { getCurrentUser } from "../features/auth/service/auth.api";

const App = () => {
  const dispatch = useDispatch();

  // Fetch current user on app mount.
  // getCurrentUser handles setUser internally — do NOT dispatch setUser here.
  useEffect(() => {
    const fetchUser = async () => {
      await getCurrentUser(dispatch);
    };
    fetchUser();
  }, [dispatch]);

  /* Auth toast notifications */
  const authSuccessMessage = useSelector(state => state.auth.successMessage);

  useEffect(() => {
    if (authSuccessMessage) {
      Toast.success(authSuccessMessage);
      dispatch(setAuthSuccessMessage(null));
    }
  }, [authSuccessMessage, dispatch]);

  /* Product toast notifications */
    const productError = useSelector((state) => state.products.error);
    const productSuccessMessage = useSelector((state) => state.products.successMessage)

  useEffect(() => {
    if (productError) {
      Toast.error(productError);
    }
  }, [productError]);

  useEffect(() => {
    if (productSuccessMessage) {
      Toast.success(productSuccessMessage);
      dispatch(setProductSuccessMessage(null));
    }
  }, [productSuccessMessage, dispatch]);

  return <RouterProvider router={routes} />;
};

export default App;