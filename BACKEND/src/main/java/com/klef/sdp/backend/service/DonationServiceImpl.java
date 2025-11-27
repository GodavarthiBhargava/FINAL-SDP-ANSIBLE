// DonationServiceImpl.java
package com.klef.sdp.backend.service;

import com.klef.sdp.backend.model.Campaign;
import com.klef.sdp.backend.model.Donation;
import com.klef.sdp.backend.model.Donor;
import com.klef.sdp.backend.repository.CampaignRepository;
import com.klef.sdp.backend.repository.DonationRepository;
import com.klef.sdp.backend.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonationServiceImpl implements DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private DonorRepository donorRepository;

    @Override
    public Donation createDonation(int donorId, int campaignId, double amount, String message) {

        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setCampaign(campaign);
        donation.setAmount(amount);
        donation.setDonationDate(LocalDateTime.now());
        donation.setMessage(message);

        campaign.setCollectedAmount(campaign.getCollectedAmount() + amount);
        campaignRepository.save(campaign);

        return donationRepository.save(donation);
    }

    @Override
    public List<Donation> getDonationsByDonor(int donorId) {
        return donationRepository.findByDonor_Id(donorId);
    }

    @Override
    public List<Donation> getDonationsByCampaign(int campaignId) {
        return donationRepository.findByCampaign_Id(campaignId);
    }

    @Override
    public double getTotalDonatedByDonor(int donorId) {
        Double total = donationRepository.getTotalAmountByDonor(donorId);
        return total != null ? total : 0.0;
    }

    @Override
    public Donation getDonationById(int id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
    }
}
