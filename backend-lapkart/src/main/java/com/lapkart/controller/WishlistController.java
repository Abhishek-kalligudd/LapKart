package com.lapkart.controller;

import com.lapkart.entity.Product;
import com.lapkart.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(wishlistService.getUserWishlist(principal.getName()));
    }

    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getWishlistIds(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(wishlistService.getUserWishlistProductIds(principal.getName()));
    }

    @PostMapping("/{productId}/toggle")
    public ResponseEntity<?> toggleWishlist(@PathVariable Long productId, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        try {
            boolean added = wishlistService.toggleWishlist(principal.getName(), productId);
            return ResponseEntity.ok(Map.of(
                    "added", added,
                    "message", added ? "Product added to wishlist" : "Product removed from wishlist"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        try {
            wishlistService.removeFromWishlist(principal.getName(), productId);
            return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
