import React, { useEffect, useState } from "react";
import axios from "axios";
import "./donorcss/BrowseCampaigns.css";
import placeholderImg from "../assets/main.png";

export default function BrowseCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [amountInput, setAmountInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [formError, setFormError] = useState("");

  // Page-level messages (top of page)
  const [pageMessage, setPageMessage] = useState("");
  const [pageMessageType, setPageMessageType] = useState(""); // "success" | "error" | ""

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

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${CAMPAIGN_API}/all`);

      const activeCampaigns = response.data
        .filter((c) => c.status === "Active")
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      setCampaigns(activeCampaigns);
      setError("");
    } catch (err) {
      setError("Failed to fetch campaigns: " + err.message);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDonateClick = (campaign) => {
    const donor = getCurrentDonor();
    if (!donor) {
      // login-related still okay to alert + redirect
      alert("Please log in as a donor before donating.");
      window.location.href = "/donor/login";
      return;
    }

    const currentRaised = Number(campaign.collectedAmount || 0);
    const goal = Number(campaign.goalAmount || 0);
    const remaining = Math.max(0, goal - currentRaised);
    if (remaining <= 0) {
      setPageMessageType("error");
      setPageMessage("This campaign is already fully funded. Thank you for your interest!");
      return;
    }

    setSelectedCampaign(campaign);
    setAmountInput("");
    setMessageInput("");
    setFormError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCampaign(null);
    setAmountInput("");
    setMessageInput("");
    setFormError("");
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    const donor = getCurrentDonor();
    if (!donor) {
      setFormError("Session expired. Please log in again.");
      setPageMessageType("error");
      setPageMessage("Session expired. Please log in again to donate.");
      return;
    }

    const currentRaised = Number(selectedCampaign.collectedAmount || 0);
    const goal = Number(selectedCampaign.goalAmount || 0);
    const remaining = Math.max(0, goal - currentRaised);

    const amount = Number(amountInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      const msg = "Please enter a valid donation amount.";
      setFormError(msg);
      setPageMessageType("error");
      setPageMessage(msg);
      return;
    }
    if (amount > remaining) {
      const msg = `Amount exceeds remaining goal (₹${remaining}). Please enter ₹${remaining} or less.`;
      setFormError(msg);
      setPageMessageType("error");
      setPageMessage(msg);
      return;
    }

    try {
      const res = await axios.post(`${DONATION_API}/add`, {
        donorId: donor.id,
        campaignId: selectedCampaign.id,
        amount,
        message: messageInput || "",
      });

      if (res.status === 200) {
        // update UI
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === selectedCampaign.id
              ? { ...c, collectedAmount: Number(c.collectedAmount || 0) + amount }
              : c
          )
        );

        // success message on page
        setPageMessageType("success");
        setPageMessage(
          `Thank you, ${donor.name}! You donated ₹${amount} to "${selectedCampaign.title}".`
        );

        handleCloseModal();
        // optionally scroll to top so message is visible
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const msg = "Donation failed. Please try again.";
        setFormError(msg);
        setPageMessageType("error");
        setPageMessage(msg);
      }
    } catch (err) {
      const msg = err.response?.data || "Error processing donation. Please try again.";
      setFormError(msg);
      setPageMessageType("error");
      setPageMessage(msg);
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const query = search.toLowerCase();
    const matchesSearch =
      c.title?.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query) ||
      c.category?.toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === "All" ||
      c.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="shop-container">
      <h2 className="shop-heading">Browse Campaigns</h2>

      {/* Page-level success / error messages */}
      {pageMessage && (
        <p
          className={
            pageMessageType === "success"
              ? "page-message page-message-success"
              : "page-message page-message-error"
          }
        >
          {pageMessage}
        </p>
      )}

      {error && <p className="error-message">{error}</p>}

      <div className="shop-filters">
        <input
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value.trimStart())}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>All</option>
          <option>Startup</option>
          <option>Charity</option>
          <option>Sponsorship</option>
          <option>Healthcare</option>
        </select>
      </div>

      {filteredCampaigns.length === 0 ? (
        <p className="no-data">No active campaigns available.</p>
      ) : (
        <div className="campaign-grid">
          {filteredCampaigns.map((c) => {
            const pct = Math.min(
              100,
              Math.floor(((c.collectedAmount || 0) / (c.goalAmount || 1)) * 100)
            );

            return (
              <div className="campaign-card" key={c.id}>
                <img
                  src={`${CAMPAIGN_API}/image/${c.id}`}
                  alt={c.title}
                  className="campaign-img"
                  onError={(e) => (e.currentTarget.src = placeholderImg)}
                />

                <div className="campaign-content">
                  <h3 className="campaign-title">{c.title}</h3>
                  <p className="campaign-desc">
                    {(c.description || "").slice(0, 80)}
                    {(c.description || "").length > 80 && "…"}
                  </p>

                  <span className="category-tag">{c.category}</span>

                  <div className="price-row">
                    <span>Goal: ₹{c.goalAmount}</span>
                    <span className="raised">Raised: ₹{c.collectedAmount}</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">{pct}% funded</p>

                  <button
                    className="donate-btn"
                    onClick={() => handleDonateClick(c)}
                  >
                    Donate Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedCampaign && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Donate to {selectedCampaign.title}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-info">
                Goal: <strong>₹{selectedCampaign.goalAmount}</strong> &nbsp; | &nbsp;
                Raised: <strong>₹{selectedCampaign.collectedAmount || 0}</strong>
              </p>
              <p className="modal-info">
                Remaining:{" "}
                <strong>
                  ₹
                  {Math.max(
                    0,
                    Number(selectedCampaign.goalAmount || 0) -
                      Number(selectedCampaign.collectedAmount || 0)
                  )}
                </strong>
              </p>

              <form className="modal-form" onSubmit={handleDonationSubmit}>
                <label htmlFor="donationAmount">Amount (₹)</label>
                <input
                  id="donationAmount"
                  type="number"
                  min="1"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="modal-input"
                  required
                />

                <label htmlFor="donationMessage">
                  Message / Description (optional)
                </label>
                <textarea
                  id="donationMessage"
                  className="modal-textarea"
                  rows={3}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Write a short note for the campaign creator..."
                />

                {formError && <p className="modal-error">{formError}</p>}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-btn secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-btn primary">
                    Confirm Donation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
