import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CollegeNav from "./collegenav";

const MyCollege = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Fix 3: Use null
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication
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
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch items only if authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      setItemsLoading(true);
      axios
        .get("https://college-olx-backend.onrender.com/mycollege", { withCredentials: true }) // Fix 1: Add withCredentials
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          console.error("Error fetching items:", error);
        })
        .finally(() => setItemsLoading(false));
    }
  }, [isAuthenticated, loading]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && isAuthenticated === false) { // Fix 2: Prevent unnecessary redirects
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) return <p>Checking authentication...</p>;

  return (
    <div>
      <CollegeNav />
      <div className="container mt-3">
        <div className="row row-cols-lg-3 row-cols-md-3 row-cols-sm-1">
          {itemsLoading ? (
            <p className="text-center w-100">Loading items...</p>
          ) : items.length > 0 ? (
            items.map((item) => (
              <a key={item._id} href={`/items/${item._id}`} className="listing-link text-decoration-none">
                <div className="card col listing-card shadow-sm">
                  <img
                    src={item.image?.url || "default-image.jpg"}
                    className="card-img-top"
                    alt="item_image"
                    style={{ height: "20rem", objectFit: "cover" }}
                  />
                  <div className="card-body bg-warning">
                    <p className="card-text text-white">
                      <b>{item.name}</b><br />
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p className="text-center w-100">No items found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCollege;
