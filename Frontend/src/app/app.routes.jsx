import { createBrowserRouter } from "react-router";
import Register        from "../features/auth/pages/Register";
import Login           from "../features/auth/pages/Login";
import CreateProduct   from "../features/products/pages/CreateProduct";
import SellerProducts  from "../features/products/pages/SellerProducts";
import Dashboard       from "../features/products/pages/Dashboard";
import ProtectedRoute  from "../features/auth/components/ProtectedRoute";
import Upcoming        from "../features/products/components/Upcoming";
import SellerLayout    from "../features/products/pages/SellerLayout";

// ─── Routes ───────────────────────────────────────────────────────
export const routes = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────
  {
    path: "/",
    element: <h1>This is home</h1>,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/seller/dashboard",
    element: (
      <ProtectedRoute>
        <SellerLayout />
      </ProtectedRoute>
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

      // Edit product  →  /seller/dashboard/edit-product/:id
      {
        path: "edit-product/:id",
        element: (
          <Upcoming
            title="Edit Product"
            description="The product editor is being polished. You'll be able to update titles, images, pricing, and more very soon."
          />
        ),
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
    element: (
      <Upcoming
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
      />
    ),
  },
]);