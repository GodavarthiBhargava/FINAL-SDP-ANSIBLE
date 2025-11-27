// DonationService.java
package com.klef.sdp.backend.service;

import com.klef.sdp.backend.model.Donation;
import java.util.List;

public interface DonationService {

    Donation createDonation(int donorId, int campaignId, double amount, String message);

    List<Donation> getDonationsByDonor(int donorId);

    List<Donation> getDonationsByCampaign(int campaignId);

    double getTotalDonatedByDonor(int donorId);

    Donation getDonationById(int id);
}
