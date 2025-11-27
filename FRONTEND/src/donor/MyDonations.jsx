// src/components/MyDonations.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./donorcss/MyDonations.css";

export default function MyDonations() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

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
    const load = async () => {
      try {
        const donor = getCurrentDonor();
        if (!donor) {
          setError("Please log in to view your donations.");
          setItems([]);
          return;
        }

        // 1) Get this donor's donations from backend
        const donationsRes = await axios.get(
          `${DONATION_API}/by-donor/${donor.id}`
        );
        const donations = donationsRes.data || [];

        if (donations.length === 0) {
          setItems([]);
          return;
        }

        // 2) Get all campaigns for extra info
        const campaignsRes = await axios.get(`${CAMPAIGN_API}/all`);
        const campaigns = campaignsRes.data || [];

        const campaignMap = {};
        campaigns.forEach((c) => {
          campaignMap[c.id] = c;
        });

        // 3) Merge donation + campaign info
        const merged = donations.map((d) => {
          const c = campaignMap[d.campaign.id] || {};
          return {
            id: d.id,
            campaignId: d.campaign.id,
            title: c.title,
            description: c.description,
            category: c.category,
            goalAmount: c.goalAmount,
            donated: d.amount,
            donationDate: d.donationDate,
            startDate: c.startDate,
            endDate: c.endDate,
          };
        });

        setItems(merged);
        setError("");
      } catch (e) {
        setError("Failed to load donations");
      }
    };

    load();
  }, []);

  return (
    <div className="browsecampaigns-container">
      <h2>My Donations</h2>
      {error && <p className="error-message">{error}</p>}

      {items.length === 0 ? (
        <p>You have not donated yet.</p>
      ) : (
        <div className="campaign-table-wrap">
          <table className="campaign-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Category</th>
                <th>Donated</th>
                <th>Goal</th>
                <th>Donation Date</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>
                    <div className="table-title">{it.title}</div>
                    <div className="table-desc">
                      {(it.description || "").slice(0, 120)}
                      {(it.description || "").length > 120 ? "…" : ""}
                    </div>
                  </td>
                  <td>
                    <span className="badge">{it.category}</span>
                  </td>
                  <td className="raised">₹{it.donated}</td>
                  <td>₹{it.goalAmount}</td>
                  <td>
                    {it.donationDate
                      ? String(it.donationDate).replace("T", " ").slice(0, 16)
                      : "—"}
                  </td>
                  <td>{it.startDate}</td>
                  <td>{it.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
