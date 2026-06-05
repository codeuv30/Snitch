// src/context/CartContext.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import useCart from "../hooks/useCart";
import { useSelector } from "react-redux";
import Toast from "@/components/ui/Toast";

export const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const {
    handleAddItem,
    handleIncrementItem,
    handleDecrementItem,
    handleGetCart,
    handleRemoveItem,
  } = useCart();

  const user = useSelector((state) => state.auth.user);

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const loading = useSelector((state) => state.cart.loading);

  useEffect(() => {
    if (!user) return;

    const loadCart = async () => {
      try {
        const result = await handleGetCart();
        if (result?.success) {
          setCart(result.cart.items || []);
        }
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };

    loadCart();
  }, [handleGetCart, user]);

  const addToCart = useCallback(
    async (product, variant = null, quantity = 1) => {
      if (!user) {
        Toast.error("Please login to add items in cart");
        return;
      }

      try {
        const result = await handleAddItem(product._id, variant?._id);

        if (result?.success) {
          // Refresh cart from API
          const cartResult = await handleGetCart();
          if (cartResult?.success) {
            setCart(cartResult.cart?.items || []);
          }

          setAddedToCart(true);
          setTimeout(() => setAddedToCart(false), 2000);
        }
      } catch (err) {
        Toast.error("Something went wrong");
        console.error("Add to cart failed:", err);
      }
    },
    [user, handleAddItem, handleGetCart],
  );

  const incrementQuantity = useCallback(
    async (productId, variantId) => {
      if (!user) {
        Toast.error("Please login to add items in cart");
        return;
      }

      try {
        await handleIncrementItem(productId, variantId);
        const result = await handleGetCart();
        if (result?.success) setCart(result.cart?.items || []);
      } catch (err) {
        Toast.error("Something went wrong");
        console.error(err);
      }
    },
    [user, handleIncrementItem, handleGetCart],
  );

  const decrementQuantity = useCallback(
    async (productId, variantId) => {
      if (!user) {
        Toast.error("Please login to add items in cart");
        return;
      }

      try {
        await handleDecrementItem(productId, variantId);
        const result = await handleGetCart();
        if (result?.success) setCart(result.cart?.items || []);
      } catch (err) {
        Toast.error("Something went wrong");
        console.error(err);
      }
    },
    [user, handleDecrementItem, handleGetCart],
  );

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price =
        item.variant?.price?.amount || item.product?.startingPrice?.amount || 0;
      return sum + Number(price) * (item.quantity || 1);
    }, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  const removeItem = useCallback(
    async (productId, variantId) => {
      if (!user) {
        Toast.error("Please login to manage cart");
        return;
      }

      try {
        await handleRemoveItem(productId, variantId);
        const result = await handleGetCart();
        if (result?.success) setCart(result.cart?.items || []);
      } catch (err) {
        Toast.error("Something went wrong");
        console.error(err);
      }
    },
    [cart],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        cartTotal,
        cartItemCount,
        addedToCart,
        loading,
        removeItem,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartUI = () => {
  const context = React.useContext(CartContext);

  if(!context) {
    throw new Error("useCartUI must be used within CartProvider");
  }

  return context;
};
