import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setError,
  setProduct,
  setProducts,
  setSellerProducts,
} from "../state/product.slice";
import {
  deleteProduct,
  fetchSellerProducts,
  getAllProducts,
  getProductDetails,
  createProduct,
  createView
} from "../services/products.api";

const useProduct = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = useCallback(
    async (formData) => {
      dispatch(setError(null));
      const data = await createProduct(formData, dispatch);
      return data.product;
    },
    [dispatch],
  );

  const handleGetSellerProducts = useCallback(async () => {
    dispatch(setError(null));

    const data = await fetchSellerProducts(dispatch);

    const products = data?.data?.products ?? data?.products ?? data?.data ?? [];

    dispatch(setSellerProducts(Array.isArray(products) ? products : []));

    return Array.isArray(products) ? products : [];
  }, [dispatch]);

  const handleDeleteProduct = useCallback(
    async (productId) => {
      const data = await deleteProduct(productId, dispatch);
      return data;
    },
    [dispatch],
  );

  const handleGetAllProducts = useCallback(async () => {
    dispatch(setError(null));
    const data = await getAllProducts(dispatch);
    dispatch(setProducts(data.data.products || []));
    return data.data.products || [];
  }, [dispatch]);

  const handleGetProductDetails = useCallback(
    async (productId) => {
      const data = await getProductDetails(productId, dispatch);

      dispatch(setProduct(data.product));
            
      return data.product;
    },
    [dispatch],
  );

  const handleCreateView = useCallback(async (productId) => {
    const data = await createView(productId, dispatch);

    return data;
  }, [dispatch]);

  return {
    handleCreateProduct,
    handleGetSellerProducts,
    handleDeleteProduct,
    handleGetAllProducts,
    handleGetProductDetails,
    handleCreateView
  };
};

export default useProduct;
