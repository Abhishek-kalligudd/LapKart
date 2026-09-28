package com.lapkart.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cat_id")
    private Long id;

    @Column(name = "cat_name", nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    private String description;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Date createdAt;
}
