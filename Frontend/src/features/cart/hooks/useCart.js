import { useDispatch } from "react-redux";
import { setError, setItems } from "../state/cart.slice";
import { addItem } from "../service/cart.api";
import {
  decrementCartItem,
  getCart,
  incrementCartItem,
  removeItem,
} from "../service/cart.api";
import { useCallback } from "react";

const useCart = () => {
  const dispatch = useDispatch();

  const handleAddItem = useCallback(async (productId, variantId) => {
    dispatch(setError(null));
    const data = await addItem(productId, variantId, dispatch);

    return data;
  }, [dispatch]);

  const handleGetCart = useCallback(async () => {
    dispatch(setError(null));
    const data = await getCart(dispatch);

    if (data?.cart?.items) {
      dispatch(setItems(data.cart.items));
    }

    return data;
  }, [dispatch]);

  const handleIncrementItem = useCallback(async (productId, variantId) => {
    dispatch(setError(null));
    const data = await incrementCartItem(productId, variantId, dispatch);

    return data;
  }, [dispatch]);

  const handleDecrementItem = useCallback(async (productId, variantId) => {
    dispatch(setError(null));
    const data = await decrementCartItem(productId, variantId, dispatch);

    return data;
  }, [dispatch]);

  const handleRemoveItem = useCallback(async (productId, variantId) => {
    dispatch(setError(null));
    const data = await removeItem(productId, variantId, dispatch);

    return data;
  }, [dispatch]);

  return {
    handleAddItem,
    handleGetCart,
    handleIncrementItem,
    handleDecrementItem,
    handleRemoveItem,
  };
};

export default useCart;
