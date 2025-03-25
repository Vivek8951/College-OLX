import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function CollegeNav() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/user", { withCredentials: true })
      .then((response) => {
        setIsAuthenticated(response.data.authenticated || false);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsAuthenticated(false);
        navigate("/login"); // Redirect to login page after logout
      }
    } catch (err) {
      console.error("An error occurred while logging out:", err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg pt-0 pb-3">
      <div className="container-fluid bg-primary  ">
        <Link to="/" className="navbar-brand fs-1 text-white ">
          College OLX
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <Link to="/mycollege" className="nav-link fs-5 mx-3 text-white">
              Buy
            </Link>
            <Link to="/sell" className="nav-link fs-5 mx-3 text-white">
              Sell
            </Link>
            {isAuthenticated ? (
              <button
                className="nav-link fs-5 mx-3 text-danger fw-bold btn btn-link"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="nav-link fs-5 mx-3">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
