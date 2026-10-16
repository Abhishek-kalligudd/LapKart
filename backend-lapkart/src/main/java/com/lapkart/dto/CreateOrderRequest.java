package com.lapkart.dto;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private String shippingAddress;
    private String contactPhone;
    private String paymentMethod; // e.g. "Cash on Delivery", "COD", etc.
}
