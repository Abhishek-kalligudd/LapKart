package com.lapkart.dto;

import lombok.Data;

@Data
public class ContactInquiryRequest {
    private String name;
    private String email;
    private String subject;
    private String message;
}
