package com.lapkart.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Date;

@Data
@Builder
public class ReviewDto {
    private Long id;
    private Long productId;
    private Long userId;
    private String username;
    private Integer rating;
    private String comment;
    private Date createdAt;
    private Double averageRating;
    private Long reviewCount;
}
