// src/components/TransactionHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./donorcss/TransactionHistory.css";

const DONATION_API = `${import.meta.env.VITE_API_URL}/donation`;

const getCurrentDonor = () => {
  try {
    const raw = localStorage.getItem("currentDonor");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  const [actionMessage, setActionMessage] = useState("");
  const [actionType, setActionType] = useState(""); // "success" | "error"

  useEffect(() => {
    const load = async () => {
      const donor = getCurrentDonor();
      if (!donor) {
        setError("Please log in to view your transaction history.");
        return;
      }

      try {
        const res = await axios.get(`${DONATION_API}/by-donor/${donor.id}`);
        setTransactions(res.data || []);
        setError("");
      } catch (e) {
        setError("Failed to load transaction history.");
      }
    };

    load();
  }, []);

  const downloadReceipt = async (donationId) => {
    setActionMessage("");
    setActionType("");

    try {
      // ✅ URL now matches backend exactly
      const res = await axios.get(
        `${DONATION_API}/receipt/${donationId}`,
        {
          responseType: "blob", // expecting PDF
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `donation_receipt_${donationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setActionType("success");
      setActionMessage("Receipt downloaded successfully.");
    } catch (err) {
      let msg = "Failed to download receipt. Please try again.";

      if (err.response) {
        if (err.response.status === 404) {
          msg = "Receipt not available for this donation (Donation not found).";
        } else if (err.response.status === 500) {
          msg = "Server error while generating receipt.";
        }
      }

      setActionType("error");
      setActionMessage(msg);
    }
  };

  const formatDateTime = (dtString) => {
    if (!dtString) return "—";
    try {
      const d = new Date(dtString);
      return d.toLocaleString();
    } catch {
      return String(dtString).replace("T", " ").slice(0, 16);
    }
  };

  return (
    <div className="tx-container">
      <h2 className="tx-heading">Transaction History</h2>

      {actionMessage && (
        <p
          className={
            actionType === "success"
              ? "tx-banner tx-banner-success"
              : "tx-banner tx-banner-error"
          }
        >
          {actionMessage}
        </p>
      )}

      {error && <p className="tx-error">{error}</p>}

      {(!transactions || transactions.length === 0) && !error ? (
        <p className="tx-empty">You have not donated yet.</p>
      ) : (
        <div className="tx-grid">
          {transactions.map((t) => (
            <div className="tx-card" key={t.id}>
              <div className="tx-card-header">
                <div>
                  <div className="tx-campaign-title">
                    {t.campaign?.title || t.campaign?.id || "Campaign"}
                  </div>
                  <div className="tx-campaign-category">
                    {t.campaign?.category || "General"}
                  </div>
                </div>
                <div className="tx-amount">₹{t.amount}</div>
              </div>

              <div className="tx-body">
                <div className="tx-row">
                  <span className="tx-label">Donation ID</span>
                  <span className="tx-value">#{t.id}</span>
                </div>
                <div className="tx-row">
                  <span className="tx-label">Date & Time</span>
                  <span className="tx-value">
                    {formatDateTime(t.donationDate)}
                  </span>
                </div>
                <div className="tx-row">
                  <span className="tx-label">Message</span>
                  <span className="tx-value">
                    {t.message && t.message.trim() !== "" ? t.message : "—"}
                  </span>
                </div>
              </div>

              <div className="tx-footer">
                <button
                  className="tx-receipt-btn"
                  onClick={() => downloadReceipt(t.id)}
                >
                  Download Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;
