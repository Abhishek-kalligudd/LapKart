package com.lapkart.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RazorpayOrderResponse {
    private String razorpayOrderId;   // Razorpay order_id (e.g. order_xxxxx)
    private Long   amount;            // in paise (multiply ₹ × 100)
    private String currency;
    private String lapkartOrderNumber; // our internal order number for reference
    private Long   lapkartOrderId;
}
