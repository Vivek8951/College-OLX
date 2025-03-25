import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CollegeNav from "./collegenav";

const Sell = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    contact: "",
    image: null, // File input
  });

  const navigate = useNavigate();

  // Check authentication
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
      })
      .finally(() => setLoading(false));
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload an image.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("image", formData.image);

    try {
      const response = await axios.post("http://localhost:8080/mycollege", formDataToSend, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Item added:", response.data);
      alert("Item listed successfully!");
      navigate("/mycollege"); // Redirect after successful post
    } catch (error) {
      console.error("Error posting item:", error);
      alert("Failed to list item.");
    }
  };

  if (loading) return <p>Checking authentication...</p>;

  return (
    <div>
      <CollegeNav />
      <div className="container mt-4">
        <h2>Sell Your Item</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Item Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Contact</label>
            <input type="text" className="form-control" name="contact" value={formData.contact} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Image</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} required />
          </div>

          <button type="submit" className="btn btn-primary">Submit Advertisement</button>
        </form>
      </div>
    </div>
  );
};

export default Sell;