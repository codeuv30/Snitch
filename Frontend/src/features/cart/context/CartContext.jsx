import React, { useState, useEffect, useMemo, useCallback } from "react";
import useCart from "../hooks/useCart";
import { useDispatch, useSelector } from "react-redux";
import Toast from "@/components/ui/Toast";
import { setTotalCount, setTotalPrice } from "../state/cart.slice";
import { useRazorpay } from "react-razorpay";
import { useNavigate } from "react-router";

export const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const {
    handleAddItem,
    handleIncrementItem,
    handleDecrementItem,
    handleGetCart,
    handleRemoveItem,
    handleCreateCartOrder,
    handleVerifyCartOrder
  } = useCart();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const [cartTotalPrice, setCartTotalPrice] = useState(null);
  const [cartTotalCount, setCartTotalCount] = useState(null);

  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalCount = useSelector((state) => state.cart.totalCount);

  const loading = useSelector((state) => state.cart.loading);

  const { error, isLoading, Razorpay } = useRazorpay();

  const loadCart = async () => {
    try {
      const result = await handleGetCart();

      dispatch(setTotalPrice(result.cart[0].totalPrice));
      dispatch(setTotalCount(result.cart[0].items.length));

      setCartTotalPrice(totalPrice);
      setCartTotalCount(totalCount);

      if (result?.success) {
        setCart(result.cart || []);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  useEffect(() => {
    if (!user) return;

    loadCart();
  }, [
    handleGetCart,
    user,
    totalPrice,
    totalCount,
    cartTotalCount,
    cartTotalPrice,
  ]);

  const addToCart = useCallback(
    async (product, variant = null) => {
      if (!user) {
        Toast.error("Please login to add items in cart");
        return;
      }
      try {
        const result = await handleAddItem(product._id, variant?._id);

        if (result?.success) {
          // Refresh cart from API
          loadCart();

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
        loadCart();
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
        loadCart();
      } catch (err) {
        Toast.error("Something went wrong");
        console.error(err);
      }
    },
    [user, handleDecrementItem, handleGetCart],
  );

  const cartTotal = useMemo(() => {
    return cartTotalPrice;
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cartTotalCount;
  }, [cart]);

  const removeItem = useCallback(
    async (productId, variantId) => {
      if (!user) {
        Toast.error("Please login to manage cart");
        return;
      }

      try {
        await handleRemoveItem(productId, variantId);
        loadCart();
      } catch (err) {
        Toast.error("Something went wrong");
        console.error(err);
      }
    },
    [cart],
  );

  const proceedToCheckout = useCallback(async () => {
    if (!user) return;

    const order = await handleCreateCartOrder();

    const orderObject = order.order;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderObject.amount,
      currency: orderObject.currency,
      name: "Snitch",
      description: "Test Transaction",
      order_id: orderObject.id,
      handler: async (response) => {
        const isValid = await handleVerifyCartOrder(response);

        if(isValid.success) {
          navigate(`/order-success?order_id=${response.razorpay_order_id}`);
        }
      },
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.contact,
      },
      theme: {
        color: "#d4a853",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();

    return orderObject;
  });

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
        loading,
        removeItem,
        proceedToCheckout,
        isLoggedIn: !!user,
        addedToCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartUI = () => {
  const context = React.useContext(CartContext);

  if (!context) {
    throw new Error("useCartUI must be used within CartProvider");
  }

  return context;
};
