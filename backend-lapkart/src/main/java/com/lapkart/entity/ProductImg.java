package com.lapkart.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "product_imgs")
public class ProductImg {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "img_id")
    private Long id;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "alt_text")
    private String altText;

    @Column(name = "is_primary")
    private Boolean isPrimary;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Product product;
}
