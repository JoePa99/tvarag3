import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./apps/auth/components/Login";
import Signup from "./apps/auth/components/Signup";
import ForgotPassword from "./apps/auth/components/ForgotPassword";
import Home from "./apps/home/components/Home";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const RequireAuth = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
