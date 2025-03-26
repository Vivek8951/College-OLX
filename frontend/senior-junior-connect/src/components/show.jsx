import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CollegeNav from "./collegenav";

const Show = () => {
  const { id } = useParams(); // Get item ID from URL
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerName, setOwnerName] = useState("Unknown"); // ✅ Add ownerName state
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://college-olx-backend.onrender.com/mycollege/${id}`, { withCredentials: true })
      .then((response) => {
        setItem(response.data.item);
        setIsOwner(response.data.isOwner);
        setOwnerName(response.data.ownerName || "Unknown"); // ✅ Store ownerName
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`https://college-olx-backend.onrender.com/mycollege/${id}`, { withCredentials: true });
      navigate("/mycollege"); 
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loading) return <p>Loading item...</p>;
  if (!item) return <p>Item not found.</p>;

  return (
    <div>
      <CollegeNav />
      <div className="container mt-4 d-flex justify-content-center">
        <div className="card shadow p-3" style={{ maxWidth: "500px", width: "100%" }}>
          <img
            src={item.image?.url || "default-image.jpg"}
            className="card-img-top"
            alt="Item"
            style={{ height: "20rem", objectFit: "cover" }}
          />
          <div className="card-body text-center">
            <h3 className="card-title">{item.name}</h3>
            <h4 className="text-success">₹{item.price.toLocaleString("en-IN")}</h4>
            <p className="card-text">{item.description}</p>
            <p className="text-muted"><strong>Contact:</strong> {item.contact}</p>
            <p className="text-muted"><strong>Owner:</strong> {ownerName}</p> 

            {isOwner && (
              <div className="mt-3">
                <button className="btn btn-warning me-2" onClick={() => navigate(`/edit/${id}`)}>Edit</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;
