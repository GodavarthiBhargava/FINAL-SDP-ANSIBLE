package com.klef.sdp.backend.dto;

public class DonationRequest {
    private int donorId;
    private int campaignId;
    private double amount;
    private String message;

    public int getDonorId() {
        return donorId;
    }
    public void setDonorId(int donorId) {
        this.donorId = donorId;
    }
    public int getCampaignId() {
        return campaignId;
    }
    public void setCampaignId(int campaignId) {
        this.campaignId = campaignId;
    }
    public double getAmount() {
        return amount;
    }
    public void setAmount(double amount) {
        this.amount = amount;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}
