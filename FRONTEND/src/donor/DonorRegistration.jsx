// src/components/DonorRegistration.jsx
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./donorcss/DonorRegistration.css";

const API_URL = `${import.meta.env.VITE_API_URL}/donor`;

export default function DonorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    mobileno: "",
    location: "",
    gender: "",
    dob: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/registration`, formData);

      if (response.status === 200) {
        setMessage(response.data);
        setError("");
        setFormData({
          name: "",
          email: "",
          username: "",
          password: "",
          mobileno: "",
          location: "",
          gender: "",
          dob: "",
        });
      }
    } catch (err) {
      setMessage("");
      setError(err.response?.data || "An unexpected error occurred.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h3>Create Donor Account</h3>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="mobileno">Mobile Number</label>
          <input
            type="tel"
            id="mobileno"
            value={formData.mobileno}
            onChange={handleChange}
            required
          />

          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <button type="submit">Create Account</button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/donor/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
