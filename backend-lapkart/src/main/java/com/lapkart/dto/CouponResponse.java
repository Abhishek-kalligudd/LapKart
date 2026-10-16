package com.lapkart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponResponse {
    private boolean valid;
    private String code;
    private Integer discountPercent;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String message;
    private String description;
}
