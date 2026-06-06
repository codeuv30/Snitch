import { createRoot } from "react-dom/client";
import "./app/App.css";
import { Provider } from "react-redux";
import { store } from "./app/app.store.js";
import { Toaster } from "sonner";
import { routes } from "./app/app.routes";
import { RouterProvider } from "react-router";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Toaster position="top-right" />
    <RouterProvider router={routes} />
  </Provider>,
);