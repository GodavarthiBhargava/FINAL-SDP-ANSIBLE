import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./donorcss/DonorDashboard.css";

export default function DonorDashboard() {
  const [totalDonated, setTotalDonated] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [topCampaign, setTopCampaign] = useState(null);
  const [numDonations, setNumDonations] = useState(0);
  const [domainData, setDomainData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);

  const CAMPAIGN_API = `${import.meta.env.VITE_API_URL}/campaign`;
  const DONATION_API = `${import.meta.env.VITE_API_URL}/donation`;

  const getCurrentDonor = () => {
    try {
      const raw = localStorage.getItem("currentDonor");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      const donor = getCurrentDonor();
      if (!donor) return;

      try {
        // Total donated
        const totalRes = await axios.get(`${DONATION_API}/summary/${donor.id}`);
        setTotalDonated(totalRes.data || 0);

        // Donations list for stats
        const donationsRes = await axios.get(`${DONATION_API}/by-donor/${donor.id}`);
        const donations = donationsRes.data || [];
        setNumDonations(donations.length);

        // Prepare data for charts
        const domainMap = {};
        const campaignMap = {};
        donations.forEach((d) => {
          const domain = d.campaign?.category || "Other";
          domainMap[domain] = (domainMap[domain] || 0) + d.amount;

          const title = d.campaign?.title || `Campaign ${d.campaign?.id}`;
          campaignMap[title] = (campaignMap[title] || 0) + d.amount;
        });

        setDomainData(
          Object.keys(domainMap).map((k) => ({ name: k, value: domainMap[k] }))
        );

        setCampaignData(
          Object.keys(campaignMap).map((k) => ({ name: k, amount: campaignMap[k] }))
        );
      } catch (err) {
        console.error(err);
      }

      try {
        const res = await axios.get(`${CAMPAIGN_API}/all`);
        const active = (res.data || []).filter((c) => c.status === "Active");
        setActiveCount(active.length);
        const ranked = [...active].sort(
          (a, b) => (b.collectedAmount || 0) - (a.collectedAmount || 0)
        );
        setTopCampaign(ranked[0] || null);
      } catch {
        setActiveCount(0);
      }
    })();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

  return (
    <div className="dashboard-container">
      <h2>Donor Dashboard</h2>

      <div className="cards">
        <div className="stat-card">
          <div className="label">Total Donated</div>
          <div className="value">₹{totalDonated}</div>
        </div>
        <div className="stat-card">
          <div className="label">Number of Donations</div>
          <div className="value">{numDonations}</div>
        </div>
        <div className="stat-card">
          <div className="label">Active Campaigns</div>
          <div className="value">{activeCount}</div>
        </div>
        <div className="stat-card">
          <div className="label">Top Campaign</div>
          <div className="value">{topCampaign ? topCampaign.title : "—"}</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Donation by Campaign</h3>
          {campaignData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No donation data.</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Donation by Domain</h3>
          {domainData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={domainData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#00C49F"
                  label
                >
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No donation data.</p>
          )}
        </div>
      </div>
    </div>
  );
}
