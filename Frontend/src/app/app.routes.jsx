import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import SellerProducts from "../features/products/pages/SellerProducts";
import Dashboard from "../features/products/pages/Dashboard";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import Upcoming from "../features/products/components/Upcoming";
import SellerLayout from "../features/products/pages/SellerLayout";
import Home from "../features/products/pages/Home";
import SellerOnly from "../features/auth/components/SellerOnly";
import NotFound from "../features/products/components/Notfound";
import NotLoggedInOnly from "../features/auth/components/NotLoggedInOnly";
import Store from "../features/products/pages/Store";
import ProductDetails from "../features/products/pages/ProductDetails";
import CreateProductVariant from "../features/products/pages/CreateProductVariant";
import EditProduct from "../features/products/pages/EditProduct";
import EditProductVariant from "../features/products/pages/EditProductVariant";

// ─── Routes ───────────────────────────────────────────────────────
export const routes = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/store",
    element: <Store />
  },
  {
    path: "/store/product/:productId",
    element: <ProductDetails />
  },
  {
    path: "/register",
    element: <NotLoggedInOnly><Register /></NotLoggedInOnly>,
  },
  {
    path: "/login",
    element: <NotLoggedInOnly><Login /></NotLoggedInOnly>,
  },
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/seller/dashboard",
    element: (
      <SellerOnly>
        <SellerLayout />
      </SellerOnly>
    ),
    children: [
      // index  →  /seller/dashboard
      {
        index: true,
        element: <Dashboard />,
      },

      // Products list  →  /seller/dashboard
      {
        path: "products",
        element: <SellerProducts />,
      },

      // Create product  →  /seller/dashboard/create-product
      {
        path: "create-product",
        element: <CreateProduct />,
      },
      {
        path: "add-variant/:productId",
        element: <CreateProductVariant />
      },

      // Edit product  →  /seller/dashboard/edit-product/:id
      {
        path: "edit-product/:productId",
        element: <EditProduct />,
      },

      {
        path: "edit-product/:productId/variants/:variantId",
        element: <EditProductVariant />
      },

      // Orders  →  /seller/dashboard/orders
      {
        path: "orders",
        element: (
          <Upcoming
            title="Orders"
            description="Order management is on its way. You'll be able to view, fulfill, and track all your orders from here."
          />
        ),
      },

      // Analytics  →  /seller/dashboard/analytics
      {
        path: "analytics",
        element: (
          <Upcoming
            title="Analytics"
            description="Deep insights into your store's performance are coming soon — revenue trends, top products, and more."
          />
        ),
      },

      // Settings  →  /seller/dashboard/settings
      {
        path: "settings",
        element: (
          <Upcoming
            title="Settings"
            description="Store settings, payout details, and account preferences will live here. Coming very soon."
          />
        ),
      },
    ],
  },

  // ── Catch-all 404 ────────────────────────────────────────────────
  {
    path: "*",
    element: <NotFound />
  },
]);
