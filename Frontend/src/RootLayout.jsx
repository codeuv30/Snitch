import { useEffect } from "react";
import { Outlet } from "react-router";
import { CartProvider } from "./features/cart/context/CartContext";
import { WishlistProvider } from "./features/wishlist/context/WishlistContext";
import Cart from "./features/cart/components/Cart";
import Wishlist from "./features/wishlist/components/Wishlist";

import { useDispatch, useSelector } from "react-redux";
import { setSuccessMessage as setAuthSuccessMessage } from "./features/auth/state/auth.slice.js";
import { setSuccessMessage as setProductSuccessMessage } from "./features/products/state/product.slice.js";
import { setSuccessMessage as setCartSuccessMessage } from "./features/cart/state/cart.slice.js";
import { setSuccessMessage as setWishlistSuccessMessage } from "./features/wishlist/state/wishlist.slice.js";

import Toast from "@/components/ui/Toast.js";
import { getCurrentUser } from "./features/auth/service/auth.api";

import useCart from "./features/cart/hooks/useCart";

const RootLayout = () => {
  const dispatch = useDispatch();

  const { handleGetCart } = useCart();

  // Fetch current user on app mount.
  // getCurrentUser handles setUser internally — do NOT dispatch setUser here.
  useEffect(() => {
    const fetchUser = async () => {
      await getCurrentUser(dispatch);
    };
    fetchUser();
  }, [dispatch]);

  /* Auth toast notifications */
  const authSuccessMessage = useSelector((state) => state.auth.successMessage);

  useEffect(() => {
    if (authSuccessMessage) {
      Toast.success(authSuccessMessage);
      dispatch(setAuthSuccessMessage(null));
    }
  }, [authSuccessMessage, dispatch]);

  /* Product toast notifications */
  const productError = useSelector((state) => state.products.error);
  const productSuccessMessage = useSelector(
    (state) => state.products.successMessage,
  );

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

  const cartError = useSelector((state) => state.cart.error);
  const cartSuccessMessage = useSelector((state) => state.cart.successMessage);

  useEffect(() => {
    if (cartError) {
      Toast.error(cartError);
    }
  }, [cartError]);

  useEffect(() => {
    if (cartSuccessMessage) {
      Toast.success(cartSuccessMessage);
      dispatch(setCartSuccessMessage(null));
    }
  }, [cartSuccessMessage, dispatch]);

  const wishlistError = useSelector((state) => state.wishlist.error);
  const wishlistSuccessMessage = useSelector(
    (state) => state.wishlist.successMessage,
  );

  useEffect(() => {
    if (wishlistError) {
      Toast.error(wishlistError);
    }
  }, [wishlistError]);

  useEffect(() => {
    if (wishlistSuccessMessage) {
      Toast.success(wishlistSuccessMessage);
      dispatch(setWishlistSuccessMessage(null));
    }
  }, [wishlistSuccessMessage, dispatch]);

  return (
    <WishlistProvider>
      <CartProvider>
        <Outlet />
        <Cart />
        <Wishlist />
      </CartProvider>
    </WishlistProvider>
  );
};

export default RootLayout;
