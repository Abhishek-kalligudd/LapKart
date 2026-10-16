package com.lapkart.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ApplyCouponRequest {
    private String code;
    private BigDecimal orderAmount;
}
