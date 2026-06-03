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
  createView,
  addVariant,
  editProduct,
  getVariant,
  editProductVariant
} from "../services/products.api";

const useProduct = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = useCallback(
    async (formData) => {
      dispatch(setError(null));
      const data = await createProduct(formData, dispatch);
      return data;
    },
    [dispatch],
  );

  const handleAddVariant = useCallback(async (productId, formData) => {
    dispatch(setError(null));

    const data = await addVariant(productId, formData, dispatch);

    return data;
  }, [dispatch]);

  const handleGetSellerProducts = useCallback(async () => {
    dispatch(setError(null));

    const data = await fetchSellerProducts(dispatch);

    const products = data?.data?.products ?? data?.products ?? data?.data ?? [];

    dispatch(setSellerProducts(Array.isArray(products) ? products : []));

    return Array.isArray(products) ? products : [];
  }, [dispatch]);

  const handleDeleteProduct = useCallback(
    async (productId) => {
      dispatch(setError(null));
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
      dispatch(setError(null));
      const data = await getProductDetails(productId, dispatch);

      dispatch(setProduct(data.product));
            
      return data;
    },
    [dispatch],
  );

  const handleCreateView = useCallback(async (productId) => {
    dispatch(setError(null));
    const data = await createView(productId, dispatch);

    return data;
  }, [dispatch]);

  const handleEditProduct = useCallback(async (formData, productId) => {
    dispatch(setError(null));
    const data = await editProduct(formData, productId, dispatch);

    return data;
  }, [dispatch])

  const handleGetVariant = useCallback(async (variantId) => {
    dispatch(setError(null));
    const data = await getVariant(variantId, dispatch);

    return data;

  }, [dispatch])

  const handleEditProductVariant = useCallback(async (productId, variantId, formData) => {
    dispatch(setError(null));
    const data = editProductVariant(productId, variantId, formData, dispatch);

    return data;
  }, [dispatch])

  return {
    handleCreateProduct,
    handleAddVariant,
    handleGetSellerProducts,
    handleDeleteProduct,
    handleGetAllProducts,
    handleGetProductDetails,
    handleCreateView,
    handleEditProduct,
    handleGetVariant,
    handleEditProductVariant
  };
};

export default useProduct;
