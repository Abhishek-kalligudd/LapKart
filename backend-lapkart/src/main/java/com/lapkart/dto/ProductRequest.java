package com.lapkart.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    private String brand;
    private String name; // maps to model_name
    private String sku;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private String processor;
    private Integer ramGb;
    private String storage;
    private String displaySpecs;
    private String gpu;
    private String os;
    private Boolean isActive;
    private Long categoryId;
    private List<ImageDto> images;

    @Data
    public static class ImageDto {
        private Long id;
        private String imageUrl;
        private String altText;
        private Boolean isPrimary;
    }
}
