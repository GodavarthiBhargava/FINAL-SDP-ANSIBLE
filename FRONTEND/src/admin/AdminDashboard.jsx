import { useEffect, useState } from "react";
import axios from "axios";
import "./admincss/AdminDashboard.css";

const API_URL = `${import.meta.env.VITE_API_URL}/admin`;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    donorCount: 0,
    creatorCount: 0,
    campaignCount: 0,
    totalDonations: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [donorRes, creatorRes, campaignRes, donationRes] = await Promise.all([
          axios.get(`${API_URL}/donorcount`),
          axios.get(`${API_URL}/creatorcount`),
          axios.get(`${API_URL}/campaigncount`),
          axios.get(`${API_URL}/donationsummary`)
        ]);

        setStats({
          donorCount: donorRes.data,
          creatorCount: creatorRes.data,
          campaignCount: campaignRes.data,
          totalDonations: donationRes.data
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>FundsConnect Overview</p>
        </div>
        <div className="admin-avatar">
          <span>A</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{stats.donorCount}</h3>
            <p>Total Donors</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.creatorCount}</h3>
            <p>Total Creators</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.campaignCount}</h3>
            <p>Total Campaigns</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <h3>₹{stats.totalDonations}</h3>
            <p>Total Donations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
