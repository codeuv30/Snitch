import { createProduct, deleteProduct, fetchSellerProducts } from "../services/products.api";
import { useDispatch } from "react-redux";
import { setError, setSellerProducts } from "../state/product.slice";

const useProduct = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = async (formData) => {

    dispatch(setError(null));

    const data = await createProduct(formData, dispatch);

    return data.product;

  };

  const handleGetSellerProducts = async () => {

    dispatch(setError(null));

    const data = await fetchSellerProducts(dispatch);

    dispatch(setSellerProducts(data.data.products || []));

    return data.data.products || []

  };

  const handleDeleteProduct = async (productId) => {
    const data = await deleteProduct(productId, dispatch);

    return data;
  }

  return { handleCreateProduct, handleGetSellerProducts, handleDeleteProduct };
};

export default useProduct;