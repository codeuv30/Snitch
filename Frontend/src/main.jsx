import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/App.css";
import App from "./app/App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/app.store.js";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <>
    <Toaster
      richColors={false}
      theme="light"
      position="top-right"
      toastOptions={{
        className: "rounded-xl border text-sm shadow-md font-medium",
        style: {
          background: "#f8f5f1",
          border: "1px solid #ded3c6",
          color: "#1f1f1f",
        },
      }}
    />
    <Provider store={store}>
      <App />
    </Provider>
  </>,
);
