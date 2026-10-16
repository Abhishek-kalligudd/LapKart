package com.lapkart.service;

import com.lapkart.dto.ContactInquiryRequest;
import com.lapkart.entity.ContactInquiry;
import com.lapkart.repository.ContactInquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactInquiryRepository contactInquiryRepository;

    public void saveInquiry(ContactInquiryRequest req) {
        if (req.getName() == null || req.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (req.getMessage() == null || req.getMessage().trim().isEmpty()) {
            throw new RuntimeException("Message is required");
        }

        ContactInquiry inquiry = new ContactInquiry();
        inquiry.setName(req.getName().trim());
        inquiry.setEmail(req.getEmail().trim().toLowerCase());
        inquiry.setSubject(req.getSubject() != null ? req.getSubject().trim() : "general");
        inquiry.setMessage(req.getMessage().trim());
        contactInquiryRepository.save(inquiry);
    }

    public java.util.List<ContactInquiry> getAllInquiries() {
        return contactInquiryRepository.findAllByOrderByCreatedAtDesc();
    }

    public void markAsRead(Long id) {
        contactInquiryRepository.findById(id).ifPresent(inq -> {
            inq.setIsRead(true);
            contactInquiryRepository.save(inq);
        });
    }
}

