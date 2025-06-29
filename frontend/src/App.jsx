import React, { useState, useEffect } from "react";
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

// Dashboard
import TemporayDash from "./pages/TemporayDash";

import ASDashboard from "./pages/AdminnStaff/Dashboard";
import LavRoom from "./pages/AdminnStaff/Lavroom";
import Users from "./pages/AdminnStaff/Users";
import Landing from "./pages/AdminnStaff/Landing";
import Switch from "./pages/AdminnStaff/Switch";

// Component to conditionally render Navbar
function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const response = await axios.get("http://localhost:5000/auth/is-verify", {
        headers: { token: localStorage.getItem("token") },
      });

      response.data ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  }, []);

  // Don't render Navbar on dashboard route
  const shouldShowNavbar = location.pathname !== "/dashboard";

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
          path="/dashboard"
          element={
            isAuthenticated ? (
              <TemporayDash setAuth={setAuth} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route exact path="/asdashboard" element={<ASDashboard />} />
        <Route exact path="/lavroom" element={<LavRoom />} />
        <Route exact path="/users" element={<Users />} />
        <Route exact path="/landing" element={<Landing />} />
        <Route exact path="/switch" element={<Switch />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
