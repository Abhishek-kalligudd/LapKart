package com.lapkart.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "order_status")
    private String orderStatus;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "shipping_address", nullable = false)
    private String shippingAddress;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Date createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private Date updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;
}
