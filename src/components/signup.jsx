import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import './login.css';
import Navbar from "./navbar";
import { supabase } from '../lib/supabase';

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null);

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            username: formData.username
          }
        }
      });

      if (authError) throw authError;

      // Create profile after successful signup
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username: formData.username,
            name: formData.name,
            email: formData.email
          }
        ]);

      if (profileError) throw profileError;

      alert("Registration Successful!");
      navigate("/mycollege");
    } catch (error) {
      console.error("Error during registration:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="login-page"> 
      <Navbar />
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>
          
          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

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