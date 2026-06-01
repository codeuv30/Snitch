import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Toast from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/spinner";

const SellerOnly = ({ children }) => {
  const navigate = useNavigate();

  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);
  const initialized = useSelector((state) => state.auth.initialized);

  useEffect(() => {
    if (initialized && !user) {
      Toast.error("You must be logged in to access this page.");
      navigate("/login");
    }
  }, [initialized, user, navigate]);

  useEffect(() => {
    if (initialized && user && user.role !== "seller") {
      Toast.error("You must be a seller to access this page.");
      navigate("/");
    }
  }, [initialized, user, navigate]);

  if (!initialized || loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner className={"size-8"} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
};

export default SellerOnly;
