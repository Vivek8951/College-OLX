import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    axios
      .get("https://college-olx-backend.onrender.com/auth/user", { withCredentials: true })
      .then((response) => {
        console.log("Auth Response:", response.data);
        setIsAuthenticated(response.data.authenticated || false);
      })
      .catch((error) => {
        console.error("Error fetching auth status:", error);
        setIsAuthenticated(false);
      });
  }, [update]);

  const handleLogout = async () => {
    try {
      const response = await axios.get("https://college-olx-backend.onrender.com/auth/logout", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setIsAuthenticated(false);
        setUpdate((prev) => !prev);
      }
    } catch (err) {
      console.error("An error occurred while logging out:", err);
    }
  };

  const navItems = [
  
    { path: "/mycollege", label: "My College" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top justify-content-center">
      <div className="container d-flex justify-content-center p-3">
        <Link className="navbar-brand fw-bold" to="/">College Olx by chirag</Link>
        <button
          className="navbar-toggler btn btn-primary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            {navItems.map(({ path, label }) => (
              <li className="nav-item" key={path}>
                <Link className={`nav-link fw-bold ${location.pathname === path ? "active text-primary" : ""}`} to={path}>
                  {label}
                </Link>
              </li>
            ))}

            {isAuthenticated ? (
              <li className="nav-item">
                <button className="nav-link btn btn-danger fw-bold" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link btn btn-success fw-bold" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-warning fw-bold" to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
