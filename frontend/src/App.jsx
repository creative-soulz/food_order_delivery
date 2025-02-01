/** @format */
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Unauthorized from "./Pages/Unauthorized";
import DefaultLayout from "./Layout/DefaultLayout";
import { adminRoute, customerRoute, deliveryManRoute } from "./route";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("simple_token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  // Sync token and role immediately on login
  useEffect(() => {
    const storedToken = localStorage.getItem("simple_token");
    const storedRole = localStorage.getItem("role");

    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
  }, []);

  // Listen for changes to localStorage (when login happens)
  useEffect(() => {
    const syncLocalStorage = () => {
      setToken(localStorage.getItem("simple_token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", syncLocalStorage);

    return () => {
      window.removeEventListener("storage", syncLocalStorage);
    };
  }, []);

  const ProtectedRoute = () => {
    return token ? <Outlet /> : <Navigate to="/" />;
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DefaultLayout />}>
              {role === "admin" &&
                adminRoute.map((item, index) => (
                  <Route
                    path={item.path}
                    name={item.name}
                    element={<item.element />}
                    key={index}
                  />
                ))}
              {role === "delivery_man" &&
                deliveryManRoute.map((item, index) => (
                  <Route
                    path={item.path}
                    name={item.name}
                    element={<item.element />}
                    key={index}
                  />
                ))}
              {role === "customer" &&
                customerRoute.map((item, index) => (
                  <Route
                    path={item.path}
                    name={item.name}
                    element={<item.element />}
                    key={index}
                  />
                ))}
            </Route>
            <Route path="*" element={<Unauthorized />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
