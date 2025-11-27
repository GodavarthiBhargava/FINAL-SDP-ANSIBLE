package com.klef.sdp.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_table")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donation_id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @ManyToOne
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private LocalDateTime donationDate;

    private String message;

    // Getters & Setters
    public int getId() { return id; }
    public Donor getDonor() { return donor; }
    public void setDonor(Donor donor) { this.donor = donor; }

    public Campaign getCampaign() { return campaign; }
    public void setCampaign(Campaign campaign) { this.campaign = campaign; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public LocalDateTime getDonationDate() { return donationDate; }
    public void setDonationDate(LocalDateTime donationDate) { this.donationDate = donationDate; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
