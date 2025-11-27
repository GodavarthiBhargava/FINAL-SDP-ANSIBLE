package com.klef.sdp.backend.service;

import com.klef.sdp.backend.model.Admin;
import com.klef.sdp.backend.model.Campaign;
import com.klef.sdp.backend.model.Creator;
import com.klef.sdp.backend.model.Donor;

import java.util.List;

public interface AdminService {

    // --- Admin ---
    Admin checkAdminLogin(String username, String password);

    // --- Creator ---
    String addCreator(Creator creator);
    List<Creator> displayCreators();
    String deleteCreator(int id);
    long displayCreatorCount();

    // --- Donor ---
    List<Donor> displayDonors();
    long displayDonorCount();

    // --- Campaign ---
    String addCampaign(Campaign campaign);
    List<Campaign> displayCampaigns();
    String deleteCampaign(int id);
    long displayCampaignCount();

    // --- Donation Summary ---
    long totalDonations();
}
