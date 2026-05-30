import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useDispatch, useSelector } from "react-redux";
import { setSuccessMessage as setAuthSuccessMessage } from "../features/auth/state/auth.slice.js";
import { setSuccessMessage as setProductSuccessMessage } from "../features/products/state/product.slice.js";
import Toast from "@/components/ui/Toast.js";
import Footer from "@/components/ui/Footer";

const App = () => {
  /* Auth */
  const { error: AuthError, successMessage: AuthSuccessMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (AuthError) {
      Toast.error(AuthError);
    }
  }, [AuthError]);

  useEffect(() => {
    if (AuthSuccessMessage) {
      Toast.success(AuthSuccessMessage);

      dispatch(setAuthSuccessMessage(null));
    }
  }, [AuthSuccessMessage]);

  /* Product */
  const { error: ProductError, successMessage: ProductSuccessMessage } = useSelector((state) => state.products);

  useEffect(() => {
    if (ProductError) {
      Toast.error(ProductError);
    }
  }, [ProductError]);

  useEffect(() => {
    if (ProductSuccessMessage) {
      Toast.success(ProductSuccessMessage);

      dispatch(setProductSuccessMessage(null));
    }
  }, [ProductSuccessMessage]);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
