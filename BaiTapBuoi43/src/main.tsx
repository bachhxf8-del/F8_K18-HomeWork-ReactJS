import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import router from "./router";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <>
    <ToastContainer />
    <RouterProvider router={router} />
  </>,
);
