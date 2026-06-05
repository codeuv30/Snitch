import React, { useCallback } from "react";
import { addItem, getWishlist, removeItem } from "../service/wishlist.api";
import { useDispatch } from "react-redux";
import { setError, setProducts } from "../state/wishlist.slice";

const useWishlist = () => {
  const dispatch = useDispatch();

  const handleAddItem = useCallback(
    async (productId, variantId) => {
      dispatch(setError(null));
      const data = await addItem(productId, variantId, dispatch);

      if (data?.wishlist?.products) {
        dispatch(setProducts(data.wishlist.products));
      }

      return data;
    },
    [dispatch],
  );

  const handleRemoveItem = useCallback(
    async (productId, variantId) => {
      dispatch(setError(null));
      const data = await removeItem(productId, variantId, dispatch);

      if (data?.wishlist?.products) {
        dispatch(setProducts(data.wishlist.products));
      }

      return data;
    },
    [dispatch],
  );

  const handleGetWishlist = useCallback(async () => {
    dispatch(setError(null));
    const data = await getWishlist(dispatch);

    return data;
  }, [dispatch]);

  return { handleAddItem, handleRemoveItem, handleGetWishlist };
};

export default useWishlist;
