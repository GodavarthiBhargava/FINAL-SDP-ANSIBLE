package com.klef.sdp.backend.controller;

import com.klef.sdp.backend.dto.DonationRequest;
import com.klef.sdp.backend.model.Donation;
import com.klef.sdp.backend.repository.DonationRepository;
import com.klef.sdp.backend.service.DonationService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/donation")
@CrossOrigin("*")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @Autowired
    private DonationRepository donationRepository;

    // Debug: check the controller is alive
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("DonationController is alive");
    }

    // Donor donates to a campaign
    @PostMapping("/add")
    public ResponseEntity<?> addDonation(@RequestBody DonationRequest request) {
        try {
            Donation donation = donationService.createDonation(
                    request.getDonorId(),
                    request.getCampaignId(),
                    request.getAmount(),
                    request.getMessage()
            );
            return ResponseEntity.ok(donation);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(400).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error: " + ex.getMessage());
        }
    }

    // For Donor Dashboard / MyDonations: only his own donations
    @GetMapping("/by-donor/{donorId}")
    public ResponseEntity<List<Donation>> getDonationsByDonor(@PathVariable int donorId) {
        List<Donation> list = donationService.getDonationsByDonor(donorId);
        return ResponseEntity.ok(list);
    }

    // For total donated on dashboard
    @GetMapping("/summary/{donorId}")
    public ResponseEntity<Double> getTotalDonatedByDonor(@PathVariable int donorId) {
        double total = donationService.getTotalDonatedByDonor(donorId);
        return ResponseEntity.ok(total);
    }

    // For creator/admin: all donations of a campaign
    @GetMapping("/by-campaign/{campaignId}")
    public ResponseEntity<List<Donation>> getDonationsByCampaign(@PathVariable int campaignId) {
        List<Donation> list = donationService.getDonationsByCampaign(campaignId);
        return ResponseEntity.ok(list);
    }

    // ✅ Download PDF receipt by donationId
    @GetMapping("/receipt/{donationId}")
    public ResponseEntity<?> downloadReceipt(@PathVariable int donationId) {
        try {
            System.out.println(">>> [Receipt] requested for donationId = " + donationId);

            // 🔍 DEBUG: print everything JPA sees
            List<Donation> all = donationRepository.findAll();
            System.out.println(">>> [Receipt] Total donations in DB (Spring): " + all.size());
            for (Donation d : all) {
                System.out.println("    - donation.id = " + d.getId()
                        + ", donorId = " + (d.getDonor() != null ? d.getDonor().getId() : null)
                        + ", campaignId = " + (d.getCampaign() != null ? d.getCampaign().getId() : null));
            }

            // find this donation in the list
            Donation donation = all.stream()
                    .filter(d -> d.getId() == donationId)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Donation not found"));

            byte[] pdfBytes = generateDonationReceiptPdf(donation);
            String fileName = "donation_receipt_" + donation.getId() + ".pdf";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (RuntimeException ex) {
            System.out.println(">>> [Receipt] Error: " + ex.getMessage());
            return ResponseEntity.status(404).body("Donation not found");
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Error generating receipt");
        }
    }

    // Helper: build a simple receipt PDF using PDFBox
    private byte[] generateDonationReceiptPdf(Donation donation) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                float margin = 60;
                float y = 800;

                // Title
                content.beginText();
                content.setFont(PDType1Font.HELVETICA_BOLD, 22);
                content.newLineAtOffset(margin, y);
                content.showText("Donation Receipt");
                content.endText();

                y -= 40;

                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm");

                String donorName     = donation.getDonor().getName();
                String donorEmail    = donation.getDonor().getEmail();
                String campaignTitle = donation.getCampaign().getTitle();
                String donationDate  = donation.getDonationDate().format(fmt);
                String amount        = "₹" + donation.getAmount();
                String message       = donation.getMessage() != null && !donation.getMessage().isBlank()
                        ? donation.getMessage()
                        : "-";

                content.beginText();
                content.setFont(PDType1Font.HELVETICA, 12);
                content.newLineAtOffset(margin, y);

                content.showText("Receipt ID   : " + donation.getId());
                content.newLineAtOffset(0, -18);
                content.showText("Donor Name   : " + donorName);
                content.newLineAtOffset(0, -18);
                content.showText("Donor Email  : " + donorEmail);
                content.newLineAtOffset(0, -18);
                content.showText("Campaign     : " + campaignTitle);
                content.newLineAtOffset(0, -18);
                content.showText("Amount       : " + amount);
                content.newLineAtOffset(0, -18);
                content.showText("Date & Time  : " + donationDate);
                content.newLineAtOffset(0, -18);
                content.showText("Message      : " + message);

                content.endText();

                // Footer thanks
                content.beginText();
                content.setFont(PDType1Font.HELVETICA_OBLIQUE, 11);
                content.newLineAtOffset(margin, 120);
                content.showText("Thank you for your generous contribution to HopeRaise.");
                content.endText();
            }

            document.save(out);
        }

        return out.toByteArray();
    }
}
