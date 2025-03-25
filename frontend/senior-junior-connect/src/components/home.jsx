import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./home.css";

export default function Home() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [update, setUpdate] = useState(false); 

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/user", { withCredentials: true })
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
      const response = await axios.get("http://localhost:8080/auth/logout", {
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
    <div>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
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

      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              type="button"
              className={`btn btn-secondary ${index === 0 ? "active" : ""}`}
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={index}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {[
            { src: "https://i.postimg.cc/XqY1vpjH/DALL-E-2025-03-25-17-19-02-A-dark-themed-desktop-wallpaper-with-the-text-COLLEGE-OLX-in-bold-fu.webp", alt: "First slide", title: "Laptops, notes, bikes – everything except attendance is available here!" },
            { src: "https://i.postimg.cc/2SDcqcSL/Random-Abstract-Wallpaper.jpg", alt: "Second slide", title: "One student’s trash is another’s semester essential" },
            { src: "https://i.postimg.cc/X7MxhHF1/Art-Random-Wallpaper.jpg", alt: "Third slide", title: "Because new books are for the rich, and we are engineering students." }
          ].map((item, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <img className="d-block w-100" src={item.src} alt={item.alt} />
              <div className="carousel-caption d-none d-md-block">
                <h5 className="fw-bold text-light bg-dark p-2 rounded">{item.title}</h5>
              
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev btn " type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next btn " type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}