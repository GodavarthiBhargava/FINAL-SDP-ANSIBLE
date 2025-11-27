package com.klef.sdp.backend.controller;

import com.klef.sdp.backend.model.Admin;
import com.klef.sdp.backend.model.Campaign;
import com.klef.sdp.backend.model.Creator;
import com.klef.sdp.backend.model.Donor;
import com.klef.sdp.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ---------------- Admin Login ----------------
    @PostMapping("/login")
    public ResponseEntity<?> checkAdminLogin(@RequestBody Admin admin) {
        Admin a = adminService.checkAdminLogin(admin.getUsername(), admin.getPassword());
        if (a != null) return ResponseEntity.ok(a);
        return ResponseEntity.status(401).body("Invalid Username or Password");
    }

    // ---------------- Creator Management ----------------
    @PostMapping("/addcreator")
    public ResponseEntity<String> addCreator(@RequestBody Creator creator) {
        return ResponseEntity.ok(adminService.addCreator(creator));
    }

    @GetMapping("/allcreators")
    public ResponseEntity<List<Creator>> displayCreators() {
        return ResponseEntity.ok(adminService.displayCreators());
    }

    @DeleteMapping("/deletecreator/{id}")
    public ResponseEntity<String> deleteCreator(@PathVariable int id) {
        return ResponseEntity.ok(adminService.deleteCreator(id));
    }

    @GetMapping("/creatorcount")
    public ResponseEntity<Long> creatorCount() {
        return ResponseEntity.ok(adminService.displayCreatorCount());
    }

    // ---------------- Donor Management ----------------
    @GetMapping("/alldonors")
    public ResponseEntity<List<Donor>> displayDonors() {
        return ResponseEntity.ok(adminService.displayDonors());
    }

    @GetMapping("/donorcount")
    public ResponseEntity<Long> donorCount() {
        return ResponseEntity.ok(adminService.displayDonorCount());
    }

    // ---------------- Campaign Management ----------------
    @PostMapping("/addcampaign")
    public ResponseEntity<String> addCampaign(@RequestBody Campaign campaign) {
        return ResponseEntity.ok(adminService.addCampaign(campaign));
    }

    @GetMapping("/allcampaigns")
    public ResponseEntity<List<Campaign>> displayCampaigns() {
        return ResponseEntity.ok(adminService.displayCampaigns());
    }

    @DeleteMapping("/deletecampaign/{id}")
    public ResponseEntity<String> deleteCampaign(@PathVariable int id) {
        return ResponseEntity.ok(adminService.deleteCampaign(id));
    }

    @GetMapping("/campaigncount")
    public ResponseEntity<Long> campaignCount() {
        return ResponseEntity.ok(adminService.displayCampaignCount());
    }

    // ---------------- Donation Summary ----------------
    @GetMapping("/donationsummary")
    public ResponseEntity<Long> totalDonations() {
        return ResponseEntity.ok(adminService.totalDonations());
    }
}
