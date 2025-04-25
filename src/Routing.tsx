import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ReactNode } from "react";

// Utility to check if user is authenticated
const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem("token")); // replace with your own logic if needed
};

// Component wrapper for private routes
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

// Routing configuration
const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated() ? "/home" : "/login"} replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default Routing;
