// src/components/DonorLogin.jsx
import { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import "./donorcss/DonorLogin.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contextapi/AuthContext";

const API_URL = `${import.meta.env.VITE_API_URL}/donor`;

export default function DonorLogin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setIsDonorLoggedIn } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(`${API_URL}/checklogin`, formData);
      if (res.status === 200) {
        const donor = res.data;

        // For older logic if needed
        sessionStorage.setItem("donor", JSON.stringify(donor));
        // New global storage
        localStorage.setItem("currentDonor", JSON.stringify(donor));

        setIsDonorLoggedIn(true);
        navigate("/donor/dashboard");
      } else {
        setMessage(res.data);
      }
    } catch (err) {
      setError(err.response?.data || "Unexpected error occurred.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Donor Sign In</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/donor/registration">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
