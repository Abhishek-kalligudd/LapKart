package com.lapkart.dto;

import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private String orderStatus;
    private String paymentStatus;
}
