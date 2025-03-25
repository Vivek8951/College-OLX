import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CollegeNav from "./collegenav";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState({
    name: "",
    price: "",
    description: "",
    contact: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch existing item details
  useEffect(() => {
    axios
      .get(`http://localhost:8080/mycollege/${id}`, { withCredentials: true })
      .then((response) => {
        const { name, price, description, contact } = response.data.item;
        setItem({ name, price, description, contact });
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
        setError("Failed to fetch item details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/mycollege/${id}`, item, { withCredentials: true });
      navigate(`/items/${id}`); // ✅ Fix navigation to correct URL
    } catch (error) {
      console.error("Error updating item:", error);
      setError("Failed to update item.");
    }
  };

  if (loading) return <p>Loading item...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <CollegeNav />
      <div className="container mt-4">
        <h2 className="text-center">Edit Item</h2>
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: "500px" }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={item.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={item.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={item.description}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contact</label>
              <input
                type="text"
                className="form-control"
                name="contact"
                value={item.contact}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-success w-100">
                Save Changes
              </button>
            </div>
            <button
              type="button" 
              className="btn btn-secondary w-100"
              onClick={() => navigate(`/items/${id}`)}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
