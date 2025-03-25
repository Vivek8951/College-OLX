import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import './login.css';
import Navbar from "./navbar";
import './home.css'

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate(); 

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 
  
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Login Successful!");
        console.log("User data:", data);
        navigate('/mycollege');
      } else {
        alert("Login Failed: " + (data.error || "Unknown error"));
      }
  
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    
    <div className="login-page">
      <Navbar/>
      
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="input-field">
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              placeholder=" " 
            />
            <label>Enter your Username</label>
          </div>
          <div className="input-field">
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder=""
            />
            <label>Enter your Password</label>
          </div>
          <button type="submit">Log In</button>
          <div className="register">
            <p>Don't have an account? <Link to='/signup'>Signup</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
