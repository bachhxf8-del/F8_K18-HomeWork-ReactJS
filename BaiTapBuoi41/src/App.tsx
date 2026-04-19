import { useState } from "react";
import Login from "./pages/Login";
import Customer from "./pages/Customer";

export default function App() {
  // Check if the token is already saved on the device.
  const [token, setToken] = useState(
    localStorage.getItem("access_token") || "",
  );

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setToken("");
  };

  // If you don't have a token yet -> Require login
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Customer token={token} onLogout={handleLogout} />;
}
