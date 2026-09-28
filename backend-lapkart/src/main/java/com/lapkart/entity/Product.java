package com.lapkart.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    @Column(nullable = false)
    private String brand;

    @Column(name = "model_name", nullable = false)
    private String name; // mapped to model_name

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "discount_price")
    private BigDecimal discountPrice;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    private String processor;
    @Column(name = "ram_gb")
    private Integer ramGb;
    private String storage;
    @Column(name = "display_specs")
    private String displaySpecs;
    private String gpu;
    private String os;
    
    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Date createdAt;
    
    @Column(name = "updated_at", insertable = false, updatable = false)
    private Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductImg> productImgs;
}
