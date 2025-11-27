import { useState } from "react";
import { NavLink, useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "../contextapi/AuthContext";
import { FiUser, FiLogOut, FiMenu, FiX, FiHome, FiSearch, FiHeart, FiFileText, FiEdit } from "react-icons/fi";

// Import Donor components
import DonorDashboard from "./DonorDashboard";
import BrowseCampaigns from "./BrowseCampaigns";
import MyDonations from "./MyDonations";
import TransactionHistory from "./TransactionHistory";
import DonorProfile from "./DonorProfile";
import UpdateProfile from "./UpdateProfile";

// Styles
import "./donorcss/DonorNavbar.css";

export default function DonorNavBar() {
  const navigate = useNavigate();
  const { setIsDonorLoggedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    sessionStorage.clear();
    setIsDonorLoggedIn(false);
    navigate("/donor/login", { replace: true });
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="donor-app-container">
      {/* Horizontal Navbar */}
      <nav className="donor-navbar">
        <div className="donor-logo">
          <span className="donor-logo-icon"></span>
          <span className="donor-logo-text">HopeRaise Donor</span>
        </div>

        <button className="donor-menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <ul className={`donor-nav-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/donor/dashboard" onClick={() => setIsMenuOpen(false)}>
              <FiHome className="nav-icon" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/donor/browse" onClick={() => setIsMenuOpen(false)}>
              <FiSearch className="nav-icon" />
              Browse Campaigns
            </NavLink>
          </li>
          <li>
            <NavLink to="/donor/mydonations" onClick={() => setIsMenuOpen(false)}>
              <FiHeart className="nav-icon" />
              My Donations
            </NavLink>
          </li>
          <li>
            <NavLink to="/donor/transactions" onClick={() => setIsMenuOpen(false)}>
              <FiFileText className="nav-icon" />
              Transaction History
            </NavLink>
          </li>
          <li>
            <NavLink to="/donor/profile" onClick={() => setIsMenuOpen(false)}>
              <FiUser className="nav-icon" />
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/donor/update" onClick={() => setIsMenuOpen(false)}>
              <FiEdit className="nav-icon" />
              Update Profile
            </NavLink>
          </li>
          <li className="donor-user-section">
            <div className="donor-user-info">
              <FiUser className="donor-user-icon" />
              <span>Donor</span>
            </div>
            <button className="donor-logout-btn" onClick={handleLogout}>
              <FiLogOut />
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="donor-main-content">
        <Routes>
          <Route path="/donor/dashboard" element={<DonorDashboard />} />
          <Route path="/donor/browse" element={<BrowseCampaigns />} />
          <Route path="/donor/mydonations" element={<MyDonations />} />
          <Route path="/donor/transactions" element={<TransactionHistory />} />
          <Route path="/donor/profile" element={<DonorProfile />} />
          <Route path="/donor/update" element={<UpdateProfile />} />
        </Routes>
      </main>
    </div>
  );
}