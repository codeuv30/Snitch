import { toast } from "sonner";

const Toast = {
  error: (message) => {
    toast.error(message, {
      style: {
        background: "#fdf7f4",
        border: "1px solid #d9b8a0",
        color: "#5c2f1f",
      },
    });
  },

  success: (message) => {
    toast.success(message, {
      style: {
        background: "#f6f8f4",
        border: "1px solid #cfd8c7",
        color: "#2f4631",
      },
    });
  },

  info: (message) => {
    toast.info(message, {
      style: {
        background: "#f5f7f8",
        border: "1px solid #cdd6dc",
        color: "#33434d",
      },
    });
  },

  warning: (message) => {
    toast.warning(message, {
      style: {
        background: "#fcf8f1",
        border: "1px solid #dbc7a0",
        color: "#6a4b1f",
      },
    });
  },
};

export default Toast;