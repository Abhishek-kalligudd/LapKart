package com.lapkart.dto;

import lombok.Data;

@Data
public class PaymentVerificationRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private Long   lapkartOrderId;   // our DB order id to mark as paid
}
