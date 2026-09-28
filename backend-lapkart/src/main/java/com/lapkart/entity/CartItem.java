package com.lapkart.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private Integer quantity;
    
    @Column(name = "created_at", insertable = false, updatable = false)
    private Date createdAt;
    
    @Column(name = "updated_at", insertable = false, updatable = false)
    private Date updatedAt;
}
