import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import './login.css';
import Navbar from "./navbar";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: ""
  });

  const navigate = useNavigate(); 

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await fetch("https://college-olx-backend.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful!");
        console.log("User registered:", data);
        navigate("/mycollege"); 
      } else {
        alert("Registration Failed: " + data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page"> 
    <Navbar></Navbar>
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        
        {/** Input Fields **/}
        {["name", "email", "username", "password"].map((field, index) => (
          <div className="input-field" key={index}>
            <input 
              type={field === "email" ? "email" : field === "password" ? "password" : "text"}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              placeholder=" " 
            />
            <label htmlFor={field}>
              {`Enter your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
            </label>
          </div>
        ))}

        <button type="submit">Register</button>

        <div className="login">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
    </div>
  );
}
