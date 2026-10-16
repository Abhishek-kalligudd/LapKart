package com.lapkart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private BigDecimal totalAmount;
    private String orderStatus;
    private String paymentStatus;
    private String shippingAddress;
    private Date createdAt;
    private List<OrderItemDto> items;
    private Long userId;
    private String customerName;
    private String customerEmail;
}
