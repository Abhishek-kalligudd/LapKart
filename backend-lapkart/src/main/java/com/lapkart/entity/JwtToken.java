package com.lapkart.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "jwt_tokens")
public class JwtToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long id;

    @Column(nullable = false, length = 500, unique = true)
    private String token;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "is_revoked")
    private Boolean isRevoked;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Date createdAt;

    @Column(name = "expires_at", nullable = false)
    private Date expiresAt;
}
