import { createBrowserRouter } from "react-router";
import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
]);

export default router;
