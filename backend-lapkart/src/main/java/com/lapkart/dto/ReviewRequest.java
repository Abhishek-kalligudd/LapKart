package com.lapkart.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long productId;
    private Integer rating; // 1-5
    private String comment;
}
