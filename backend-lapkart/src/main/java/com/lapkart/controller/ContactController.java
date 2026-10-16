package com.lapkart.controller;

import com.lapkart.dto.ContactInquiryRequest;
import com.lapkart.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    /** POST /api/public/contact — No auth required, saves inquiry to DB */
    @PostMapping
    public ResponseEntity<?> submitInquiry(@RequestBody ContactInquiryRequest req) {
        try {
            contactService.saveInquiry(req);
            return ResponseEntity.ok(Map.of("message", "Your inquiry has been received. We'll get back to you shortly!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
