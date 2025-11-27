package com.klef.sdp.backend.service;

import com.klef.sdp.backend.model.Admin;
import com.klef.sdp.backend.model.Campaign;
import com.klef.sdp.backend.model.Creator;
import com.klef.sdp.backend.model.Donor;
import com.klef.sdp.backend.repository.AdminRepository;
import com.klef.sdp.backend.repository.CampaignRepository;
import com.klef.sdp.backend.repository.CreatorRepository;
import com.klef.sdp.backend.repository.DonorRepository;
import com.klef.sdp.backend.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CreatorRepository creatorRepository;

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private DonationRepository donationRepository;

    // ---------------- Admin ----------------
    @Override
    public Admin checkAdminLogin(String username, String password) {
        return adminRepository.findByUsernameAndPassword(username, password);
    }

    // ---------------- Creator ----------------
    @Override
    public String addCreator(Creator creator) {
        creatorRepository.save(creator);
        return "Creator Added Successfully";
    }

    @Override
    public List<Creator> displayCreators() {
        return creatorRepository.findAll();
    }

    @Override
    public String deleteCreator(int id) {
        Optional<Creator> creator = creatorRepository.findById(id);
        if (creator.isPresent()) {
            creatorRepository.deleteById(id);
            return "Creator Deleted Successfully";
        }
        return "Creator ID Not Found";
    }

    @Override
    public long displayCreatorCount() {
        return creatorRepository.count();
    }

    // ---------------- Donor ----------------
    @Override
    public List<Donor> displayDonors() {
        return donorRepository.findAll();
    }

    @Override
    public long displayDonorCount() {
        return donorRepository.count();
    }

    // ---------------- Campaign ----------------
    @Override
    public String addCampaign(Campaign campaign) {
        campaignRepository.save(campaign);
        return "Campaign Added Successfully";
    }

    @Override
    public List<Campaign> displayCampaigns() {
        return campaignRepository.findAll();
    }

    @Override
    public String deleteCampaign(int id) {
        Optional<Campaign> campaign = campaignRepository.findById(id);
        if (campaign.isPresent()) {
            campaignRepository.deleteById(id);
            return "Campaign Deleted Successfully";
        }
        return "Campaign ID Not Found";
    }

    @Override
    public long displayCampaignCount() {
        return campaignRepository.count();
    }

    // ---------------- Donation Summary ----------------
    @Override
    public long totalDonations() {
        return donationRepository.sumAllDonations();
    }
}
