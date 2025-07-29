import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

// Landing Pages
import LandingPage from "./LandingPage";
import Login from "./landing pages/Login";
import Register from "./landing pages/Register";

// Dashboards
import TuteePage from "./pages/Tutee/TuteePage"; //role = student
import TutorPage from "./pages/Tutor/TutorPage"; //role = tutor
import AdminPage from "./pages/AdminnStaff/AdminPage"; //role = admin

// Role-based dashboard component
function RoleBasedDashboard({ setAuth }) {
  const role = localStorage.getItem("role");

  switch (role) {
    case "admin":
      return <AdminPage setAuth={setAuth} />;
    case "tutor":
      return <TutorPage setAuth={setAuth} />;
    case "student":
      return <TuteePage setAuth={setAuth} />;
    default:
      // Redirect to login if role is not recognized
      return <Navigate to="/login" />;
  }
}

// Component to conditionally render Navbar
function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const isAuth = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/is-verify", {
        headers: { token: localStorage.getItem("token") },
        role: localStorage.getItem("role"),
      });

      response.data ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  useEffect(() => {
    isAuth();
  }, [isAuth]);

  // Don't render Navbar on dashboard routes
  const shouldShowNavbar = !location.pathname.startsWith("/dashboard") && !location.pathname.startsWith("/login") && !location.pathname.startsWith("/register");

  return (
    <div>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route
          exact
          path="/login"
          element={
            !isAuthenticated ? (
              <Login setAuth={setAuth} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          exact
          path="/register"
          element={
            !isAuthenticated ? (
              <Register setAuth={setAuth} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          exact
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <RoleBasedDashboard setAuth={setAuth} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
