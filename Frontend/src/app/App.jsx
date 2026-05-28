import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useDispatch, useSelector } from "react-redux";
import { setSuccessMessage } from "../features/auth/state/auth.slice.js";
import Toast from "@/components/ui/Toast.js";

const App = () => {
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      Toast.success(successMessage);

      dispatch(setSuccessMessage(null));
    }
  }, [successMessage]);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
