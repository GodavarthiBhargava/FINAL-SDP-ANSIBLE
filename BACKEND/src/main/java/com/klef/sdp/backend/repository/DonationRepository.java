package com.klef.sdp.backend.repository;

import com.klef.sdp.backend.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Integer> {

    List<Donation> findByDonor_Id(int donorId);

    List<Donation> findByCampaign_Id(int campaignId);

    @Query("select coalesce(sum(d.amount), 0) from Donation d where d.donor.id = :donorId")
    Double getTotalAmountByDonor(@Param("donorId") int donorId);
}
