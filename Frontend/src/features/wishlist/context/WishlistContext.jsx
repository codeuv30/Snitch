// src/wishlist/context/WishlistContext.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import useWishlist from "../hooks/useWishlist";
import { useSelector } from "react-redux";
import Toast from "@/components/ui/Toast";

export const WishlistContext = React.createContext();

export const WishlistProvider = ({ children }) => {
  const { handleAddItem, handleRemoveItem, handleGetWishlist } = useWishlist();

  const user = useSelector((state) => state.auth.user);

  const [wishlist, setWishlist] = useState([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  const loading = useSelector((state) => state.wishlist.loading);

  useEffect(() => {
    if (!user) return;

    const loadWishlist = async () => {
      try {
        const result = await handleGetWishlist();
        if (result?.success) {
          setWishlist(result.wishlist?.products || []);
        }
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      }
    };

    loadWishlist();
  }, [handleGetWishlist, user]);

  const addToWishlist = useCallback(
    async (product, variant = null) => {
      if (!user) {
        Toast.error("Please login to add items to wishlist");
        return;
      }

      if (!product?._id) {
        Toast.error("Please select a product first");
        return;
      }

      if (!variant?._id) {
        Toast.error("Please select a variant first");
        return;
      }

      try {
        const result = await handleAddItem(product._id, variant?._id);

        if (result?.success) {
          const wishlistResult = await handleGetWishlist();
          if (wishlistResult?.success) {
            setWishlist(wishlistResult.wishlist?.items || []);
          }

          setAddedToWishlist(true);
          setTimeout(() => setAddedToWishlist(false), 2000);
        }
      } catch (err) {
        Toast.error("Something went wrong");
        console.error("Add to wishlist failed:", err);
      }
    },
    [user, handleAddItem, handleGetWishlist],
  );

  const removeItem = useCallback(
    async (productId, variantId) => {
      if (!user) {
        Toast.error("Please login to manage wishlist");
        return;
      }
      if (!productId) return;
      if (!variantId) return;

      try {
        await handleRemoveItem(productId, variantId);
        const result = await handleGetWishlist();
        if (result?.success) setWishlist(result.wishlist?.items || []);
      } catch (err) {
        Toast.error("Something went wrong");
        console.error(err);
      }
    },
    [user, handleRemoveItem, handleGetWishlist],
  );

  const toggleWishlist = useCallback(
    async (product, variant = null) => {
      if (!user) {
        Toast.error("Please login to manage wishlist");
        return;
      }
      if (!product?._id) {
        Toast.error("Please select a product first");
        return;
      }
      if (!variant?._id) {
        Toast.error("Please select a variant first");
        return;
      }

      const isInList = wishlist.some(
        (item) =>
          item.product._id === product._id &&
          (variant ? item.variant?._id === variant._id : !item.variant),
      );

      try {
        if (isInList) {
          await handleRemoveItem(product._id, variant?._id);
        } else {
          if (!product._id) {
            Toast.error("Please select a product first");
            return;
          }

          if (!variant._id) {
            Toast.error("Please select a variant first");
            return;
          }
          await handleAddItem(product._id, variant?._id);
        }

        const result = await handleGetWishlist();
        if (result?.success) setWishlist(result.wishlist?.items || []);
      } catch (err) {
        Toast.error("Something went wrong");
        console.error(err);
      }
    },
    [user, wishlist, handleAddItem, handleRemoveItem, handleGetWishlist],
  );

  const isInWishlist = useCallback(
    (productId, variantId = null) => {
      if (!productId) return;
      if (!variantId) return;

      return wishlist.some((item) => {
        const productMatch = item.product._id === productId;
        if (variantId) {
          return productMatch && item.variant?._id === variantId;
        }
        return productMatch;
      });
    },
    [wishlist],
  );

  const wishlistItemCount = useMemo(() => {
    return wishlist.length;
  }, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistOpen,
        setWishlistOpen,
        addToWishlist,
        removeItem,
        toggleWishlist,
        isInWishlist,
        wishlistItemCount,
        addedToWishlist,
        loading,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistUI = () => {
  const context = React.useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlistUI must be used within WishlistProvider");
  }

  return context;
};
